import { forwardRef, useEffect, useRef, useState } from 'react';
import EdgeworkCard from '@/components/EdgeworkCard';

// Shows an Edgework card scaled to fit its column. The card underneath stays at full
// export size, and the forwarded ref points at it for PNG export.
const TemplatePreview = forwardRef(function TemplatePreview({ draft, template, mix, animate }, ref) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const measure = () => {
      const w = boxRef.current?.clientWidth || 400;
      const maxH = template.height > template.width ? 720 : 640;
      setScale(Math.min(w / template.width, maxH / template.height));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [template.width, template.height]);

  return (
    <div ref={boxRef} className="w-full">
      <div
        className="ew-sheet"
        style={{ width: template.width * scale, height: template.height * scale, overflow: 'hidden' }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: template.width, height: template.height }}>
          <EdgeworkCard ref={ref} draft={draft} templateKey={template.key} mix={mix} animate={animate} />
        </div>
      </div>
    </div>
  );
});

export default TemplatePreview;
