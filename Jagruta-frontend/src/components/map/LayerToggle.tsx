import * as React from 'react';
import { useAppStore } from '../../store/app.store';
import { cn } from '../../lib/utils';
import { LayoutGrid, Users, Flag } from 'lucide-react';

export const LayerToggle = () => {
  const { mapLayer, setMapLayer } = useAppStore();

  const layers = [
    { id: 'ward', label: 'Ward', icon: LayoutGrid },
    { id: 'assembly', label: 'Assembly', icon: Users },
    { id: 'parliament', label: 'Parliament', icon: Flag },
  ] as const;

  return (
    <div className="layer-toggle">
      {layers.map((layer) => (
        <button
          key={layer.id}
          onClick={() => setMapLayer(layer.id)}
          className={cn(
            "layer-pill flex items-center gap-2",
            mapLayer === layer.id && "active"
          )}
        >
          <layer.icon size={14} />
          {layer.label}
        </button>
      ))}
    </div>
  );
};
