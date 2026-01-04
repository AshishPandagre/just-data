import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDashboardById } from '../../../utils/storageUtils';
import LayoutStep from '../../configurator/components/LayoutStep';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { ArrowLeft, Info, Download } from 'lucide-react';

const DashboardViewerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const dashboard = useMemo(() => {
        return getDashboardById(id);
    }, [id]);

    const handleExportPDF = async () => {
        const headerElement = document.getElementById('dashboard-header');
        const contentElement = document.getElementById('dashboard-layout-capture');
        const rootElement = document.getElementById('dashboard-export-container');

        if (!headerElement || !contentElement || !rootElement) return;

        // Variables for restoration
        let scrollableContainer = null;
        let originalRootHeight = '';
        let originalRootOverflow = '';
        let originalContentHeight = '';
        let originalContentOverflow = '';
        let originalScrollHeight = '';
        let originalScrollOverflow = '';
        let originalScrollMaxHeight = '';

        try {
            // --- 1. Prepare DOM for Capture (Expand everything) ---
            scrollableContainer = contentElement.querySelector('.overflow-y-auto');

            originalRootHeight = rootElement.style.height;
            originalRootOverflow = rootElement.style.overflow;

            originalContentHeight = contentElement.style.height;
            originalContentOverflow = contentElement.style.overflow;

            if (scrollableContainer) {
                originalScrollHeight = scrollableContainer.style.height;
                originalScrollOverflow = scrollableContainer.style.overflow;
                originalScrollMaxHeight = scrollableContainer.style.maxHeight;
            }

            // Apply "Expanded" styles to force full render
            // unlock root container (screen height)
            rootElement.style.height = 'auto';
            rootElement.style.overflow = 'visible';

            // unlock content wrapper
            contentElement.style.height = 'auto';
            contentElement.style.overflow = 'visible';

            // unlock inner scroll
            if (scrollableContainer) {
                scrollableContainer.style.height = 'auto'; // Will grow to fit content
                scrollableContainer.style.overflow = 'visible';
                scrollableContainer.style.maxHeight = 'none';
            }

            // Wait for simple repaint/reflow
            await new Promise(resolve => setTimeout(resolve, 500));

            // --- 2. Capture ---
            // Recalculate dimensions now that it is expanded
            const currentTotalHeight = contentElement.scrollHeight; // Should be huge now
            const currentTotalWidth = contentElement.scrollWidth;

            // Define PDF dimensions
            // Use width as base
            const pdfWidth = currentTotalWidth;
            const pdfPageHeight = pdfWidth * 1.414; // A4 Portrait ratio

            console.log('Capture Dims:', { pdfWidth, currentTotalHeight, pdfPageHeight });

            const headerDataUrl = await toPng(headerElement, { quality: 0.95, backgroundColor: '#ffffff' });

            const contentDataUrl = await toPng(contentElement, {
                quality: 0.90,
                pixelRatio: 1,
                backgroundColor: '#f8fafc',
                width: pdfWidth,
                height: currentTotalHeight,
                // Reinforce styles just in case
                style: {
                    height: `${currentTotalHeight}px`,
                    overflow: 'visible',
                    display: 'block'
                }
            });

            // --- 3. Restore DOM Immediately ---
            if (scrollableContainer) {
                scrollableContainer.style.height = originalScrollHeight;
                scrollableContainer.style.overflow = originalScrollOverflow;
                scrollableContainer.style.maxHeight = originalScrollMaxHeight;
            }
            contentElement.style.height = originalContentHeight;
            contentElement.style.overflow = originalContentOverflow;
            rootElement.style.height = originalRootHeight;
            rootElement.style.overflow = originalRootOverflow;

            // --- 4. Generate PDF ---
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [pdfWidth, pdfPageHeight]
            });

            const headerHeight = headerElement.offsetHeight;
            let heightLeft = currentTotalHeight;

            // Page 1: Header + Start of Content
            pdf.addImage(headerDataUrl, 'PNG', 0, 0, pdfWidth, headerHeight);

            // Calculate how much content fits on P1
            const p1ContentSpace = pdfPageHeight - headerHeight;
            pdf.addImage(contentDataUrl, 'PNG', 0, headerHeight, pdfWidth, currentTotalHeight);

            heightLeft -= p1ContentSpace;

            let pageCount = 1;

            // --- Subsequent Pages ---
            while (heightLeft > 0) {
                pdf.addPage([pdfWidth, pdfPageHeight]);
                pageCount++;

                // Offset calculation
                // For P2, we need to shift content UP by p1ContentSpace
                // For P3, shift UP by p1ContentSpace + 1*pdfPageHeight

                const offset = - (p1ContentSpace + (pageCount - 2) * pdfPageHeight);

                // We draw the SAME huge image, just shifted so visible window changes
                pdf.addImage(contentDataUrl, 'PNG', 0, offset, pdfWidth, currentTotalHeight);

                heightLeft -= pdfPageHeight;
            }

            pdf.save(`${dashboard?.metadata?.title || 'dashboard'}.pdf`);

        } catch (error) {
            console.error('Failed to export PDF:', error);
            // Ensure restore happens even on error
            if (scrollableContainer) {
                scrollableContainer.style.height = originalScrollHeight;
                scrollableContainer.style.overflow = originalScrollOverflow;
                scrollableContainer.style.maxHeight = originalScrollMaxHeight;
            }
            if (rootElement) {
                rootElement.style.height = originalRootHeight;
                rootElement.style.overflow = originalRootOverflow;
            }
            if (contentElement) {
                contentElement.style.height = originalContentHeight;
                contentElement.style.overflow = originalContentOverflow;
            }
        }
    };

    if (!dashboard) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-800">Dashboard Not Found</h2>
                    <p className="text-slate-500 mt-2">The dashboard you are looking for does not exist.</p>
                    <button
                        onClick={() => navigate('/dashboards')}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Go back to dashboards
                    </button>
                </div>
            </div>
        );
    }

    const { metadata, charts, filters, data } = dashboard;

    return (
        <div id="dashboard-export-container" className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <header id="dashboard-header" className="bg-white border-b border-slate-200 shrink-0">
                <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboards')}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="font-bold text-lg text-slate-800">
                                {metadata?.title || 'Untitled Dashboard'}
                            </h1>
                            {metadata?.description && (
                                <div className="flex items-center gap-1.5 mt-0.5 text-slate-500" title="Dashboard Purpose">
                                    <Info size={14} className="shrink-0" />
                                    <p className="text-sm">{metadata.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Download size={16} /> Export PDF
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                <LayoutStep
                    filters={filters || []}
                    charts={charts || []}
                    data={data || []}
                    readOnly={true}
                />
            </div>
        </div>
    );
};

export default DashboardViewerPage;
