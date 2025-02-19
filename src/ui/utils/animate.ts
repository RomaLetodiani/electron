type AnimateWindowProps = {
  height: number;
  width?: number;
  duration?: number;
};

export const animateWindow = async ({ height, width = 510, duration = 250 }: AnimateWindowProps) => {
  const bounds = await window.electron.getBounds();
  if (!bounds) return;

  const startWidth = bounds.width;
  const startHeight = bounds.height;
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = progress * (2 - progress);

    const newWidth = startWidth + (width - startWidth) * eased;
    const newHeight = startHeight + (height - startHeight) * eased;

    window.electron.resizeWindow(Math.round(newWidth), Math.round(newHeight));

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

export const animateWindowVariants = {
  collapsed: {
    width: 160,
    height: 40,
  },
  home: {
    height: 275,
  },
};

export const homeWindow = () => animateWindow(animateWindowVariants.home);

export const collapseWindow = () => animateWindow(animateWindowVariants.collapsed);
