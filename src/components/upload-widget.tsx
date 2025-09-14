import * as Collapsible from '@radix-ui/react-collapsible';
import { UploadWidgetDropzone } from './upload-widget-dropzone';
import { UploadWidgetHeader } from './upload-widget-header';
import { UploadWidgetList } from './upload-widget-upload-list';
import { useState } from 'react';
import { UploadWidgetMinimizedButton } from './upload-widget-minimized-button';

export function UploadWidget() {
  // Inicia ABERTO (true) para mostrar o conteúdo por padrão
  const [isWidgetOpen, setIsWidgetOpen] = useState(true);

  return (
    <Collapsible.Root open={isWidgetOpen} onOpenChange={setIsWidgetOpen}>
      <div className="bg-zinc-900 overflow-hidden w-[360px] rounded-xl shadow-shape">
        {/* Mostra o botão minimizado apenas quando está FECHADO */}
        {!isWidgetOpen && <UploadWidgetMinimizedButton />}

        {/* Conteúdo que será mostrado/escondido */}
        <Collapsible.Content>
          <UploadWidgetHeader />

          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />

            <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />

            <UploadWidgetList />
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
