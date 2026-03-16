export function createCleanupManager() {
    const cleanupTasks = [];

    function add(task) {
        if(typeof task === 'function') {
            cleanupTasks.push(task);
        }
    }

    function runAll() {
        cleanupTasks.forEach(task => { task(); });
        cleanupTasks.length = 0; // Clear tasks after running
    }

    return {
        add,
        runAll
    };
}