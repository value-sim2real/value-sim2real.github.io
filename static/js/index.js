function isVideoSelected(video) {
  const demoPane = video.closest('.demo-pane');
  return video.closest('.task-pane').classList.contains('is-active') &&
    (!demoPane || demoPane.classList.contains('is-active'));
}

function updateVideoState(video) {
  const container = video.closest('.video-container');
  container.dataset.state = video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE ? 'error' :
    video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA ? 'ready' : 'loading';
}

function playSelectedVideo(video) {
  if (!video || !isVideoSelected(video)) return;
  video.preload = 'auto';
  updateVideoState(video);
  // play() also starts loading videos whose preload was initially "none".
  // Native controls remain available if the browser blocks autoplay.
  video.play().catch(() => {});
}

function switchTaskTab(evt, taskId, tabsId = 'policyTaskTabs') {
  if (evt) evt.preventDefault();
  const taskTabs = document.getElementById(tabsId);
  // Update main task tabs
  const tabList = taskTabs.querySelectorAll('li');
  tabList.forEach(tab => tab.classList.remove('is-active'));
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add('is-active');
  } else {
    const defaultTab = document.getElementById(`tab-${taskId}`);
    if (defaultTab) defaultTab.classList.add('is-active');
  }

  // Update task panes
  const taskPanes = taskTabs.closest('section').querySelectorAll('.task-pane');
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
    // Some sections have demo sub-tabs; others have one video per task.
    const activeDemoPane = selectedPane.querySelector('.demo-pane.is-active');
    const activeVideo = (activeDemoPane || selectedPane).querySelector('video');
    playSelectedVideo(activeVideo);
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
    playSelectedVideo(activeVideo);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.video-player').forEach(video => {
    const container = video.closest('.video-container');
    const showError = () => { container.dataset.state = 'error'; };

    video.addEventListener('loadeddata', () => updateVideoState(video));
    video.addEventListener('canplay', () => updateVideoState(video));
    video.addEventListener('playing', () => {
      // A play request can finish after the visitor has switched tabs.
      if (!isVideoSelected(video)) video.pause();
      updateVideoState(video);
    });
    video.addEventListener('emptied', () => updateVideoState(video));
    video.addEventListener('error', showError);
    // Failed <source> requests do not bubble an error to the <video>.
    video.querySelectorAll('source').forEach(source => {
      source.addEventListener('error', showError);
    });

    container.querySelector('.video-retry').addEventListener('click', () => {
      container.dataset.state = 'loading';
      video.load();
      playSelectedVideo(video);
    });

    // Cached videos may have loaded before these listeners were registered.
    updateVideoState(video);
    playSelectedVideo(video);
  });
});
