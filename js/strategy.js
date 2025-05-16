export const strategies = {
  upcoming: tasks => tasks.sort((a, b) => new Date(b.date) - new Date(a.date)),
  recent: tasks => tasks.sort((a, b) => new Date(a.date) - new Date(b.date)),
  titleAsc: tasks => tasks.sort((a, b) => a.title.localeCompare(b.title)),
  titleDesc: tasks => tasks.sort((a, b) => b.title.localeCompare(a.title)),
  priority: tasks => {
    const priorityOrder = { 'yüksek': 0, 'normal': 1, 'düşük': 2 };
    return tasks.sort((a, b) => {
      return priorityOrder[a.priority || 'normal'] - priorityOrder[b.priority || 'normal'];
    });
  }
};

export const filters = {
  category: (tasks, category) => {
    if (category === 'all') return tasks;
    return tasks.filter(task => task.category === category);
  },
  status: (tasks, status) => {
    if (status === 'all') return tasks;
    return tasks.filter(task => {
      if (status === 'completed') return task.completed;
      if (status === 'active') return !task.completed;
      return true;
    });
  }
};