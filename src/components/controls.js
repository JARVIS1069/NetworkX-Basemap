export function setupControls({ onSpeedChange, onToggleLabels, onToggleRotation }) {
  // Speed control
  const speedSlider = document.getElementById('speed');
  const speedValue = document.getElementById('speed-value');
  
  speedSlider.addEventListener('input', (e) => {
    const speed = parseFloat(e.target.value);
    speedValue.textContent = `${speed}x`;
    onSpeedChange(speed);
  });
  
  // Toggle labels
  document.getElementById('toggle-labels').addEventListener('click', () => {
    onToggleLabels();
  });
  
  // Toggle rotation
  document.getElementById('toggle-rotation').addEventListener('click', () => {
    onToggleRotation();
  });
}