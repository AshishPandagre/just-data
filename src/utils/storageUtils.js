const STORAGE_KEY = 'dashboards';

export const getDashboards = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading dashboards from storage:', error);
        return [];
    }
};

export const getDashboardById = (id) => {
    try {
        const dashboards = getDashboards();
        return dashboards.find(d => d.id === id) || null;
    } catch (error) {
        console.error('Error getting dashboard by id:', error);
        return null;
    }
};

export const saveDashboard = (dashboard) => {
    try {
        const dashboards = getDashboards();
        const index = dashboards.findIndex(d => d.id === dashboard.id);

        if (index >= 0) {
            dashboards[index] = dashboard;
        } else {
            dashboards.push(dashboard);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards));
        return true;
    } catch (error) {
        console.error('Error saving dashboard:', error);
        return false;
    }
};

export const deleteDashboard = (id) => {
    try {
        const dashboards = getDashboards();
        const filtered = dashboards.filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error deleting dashboard:', error);
        return false;
    }
};
