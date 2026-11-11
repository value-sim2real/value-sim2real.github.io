function switchTaskTab(evt, taskId) {
  // Update main task tabs
  const tabList = document.querySelectorAll('#policyTaskTabs li');
  tabList.forEach(tab => tab.classList.remove('is-active'));
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add('is-active');
  } else {
    const defaultTab = document.getElementById(`tab-${taskId}`);
    if (defaultTab) defaultTab.classList.add('is-active');
  }

  // Update task panes
  const taskPanes = document.querySelectorAll('.task-pane');
  taskPanes.forEach(pane => {
    pane.classList.remove('is-active');
    // Pause any playing videos in hidden panes
    pane.querySelectorAll('video').forEach(v => {
      if (!v.paused) v.pause();
    });
  });

  const selectedPane = document.getElementById(`pane-${taskId}`);
  if (selectedPane) {
    selectedPane.classList.add('is-active');
    // Play video in the currently active demo pane if available
    const activeDemoPane = selectedPane.querySelector('.demo-pane.is-active');
    if (activeDemoPane) {
      const activeVideo = activeDemoPane.querySelector('video');
      if (activeVideo && (activeVideo.currentSrc || activeVideo.src)) {
        activeVideo.play().catch(e => console.log("Autoplay notice:", e));
      }
    }
  }
}

function switchDemoTab(evt, taskId, demoIndex) {
  const taskPane = document.getElementById(`pane-${taskId}`);
  if (!taskPane) return;

  // Update demo sub-tabs in this task
  const demoTabs = taskPane.querySelectorAll('.demo-sub-tabs li');
  demoTabs.forEach(tab => tab.classList.remove('is-active'));
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add('is-active');
  } else {
    const defaultSubTab = document.getElementById(`subtab-${taskId}-${demoIndex}`);
    if (defaultSubTab) defaultSubTab.classList.add('is-active');
  }

  // Update demo video panes in this task
  const demoPanes = taskPane.querySelectorAll('.demo-pane');
  demoPanes.forEach(pane => {
    pane.classList.remove('is-active');
    pane.querySelectorAll('video').forEach(v => {
      if (!v.paused) v.pause();
    });
  });

  const selectedDemoPane = document.getElementById(`video-pane-${taskId}-${demoIndex}`);
  if (selectedDemoPane) {
    selectedDemoPane.classList.add('is-active');
    const activeVideo = selectedDemoPane.querySelector('video');
    if (activeVideo && (activeVideo.currentSrc || activeVideo.src)) {
      activeVideo.play().catch(e => console.log("Autoplay notice:", e));
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Listen for video loaded/error states on all video players
  document.querySelectorAll('.video-player').forEach(video => {
    video.addEventListener('loadeddata', function() {
      if (this.videoWidth > 0) {
        this.style.display = 'block';
        const placeholder = this.parentElement.querySelector('.placeholder-overlay');
        if (placeholder) {
          placeholder.style.display = 'none';
        }
      }
    });

    video.addEventListener('error', function() {
      this.style.display = 'none';
      const placeholder = this.parentElement.querySelector('.placeholder-overlay');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    });
  });
});
