import { useState, useRef } from "react";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ImageUploadPreview from "./ImageUploadPreview";

function AvatarUploadAndCrop({ inputRef, onCrop, visible, onHide }) {
  const [image, setImage] = useState(null);
  const [isUploadImage, setIsUploadImage] = useState(false);
  const stepperRef = useRef(null);

  const handleFile = (file) => setImage(file);
  const handleUploadImage = () => setIsUploadImage(true);

  return (
    <>
      <Dialog
        visible={visible}
        modal
        dismissableMask
        blockScroll
        draggable={false}
        className="w-[95%]"
        header="更換頭貼"
        style={{ width: "50rem" }}
        onHide={() => {
          onHide();
          setIsUploadImage(false);
        }}
        transitionOptions={{
          classNames: "p-dialog",
          timeout: { enter: 300, exit: 300 },
        }}
        pt={{
          content: { className: "overflow-hidden" },
        }}
      >
        <div className="card flex justify-content-center">
          <Stepper ref={stepperRef} className="w-full" linear>
            <StepperPanel header="選擇">
              <div className="flex flex-column h-12rem">
                <ImageUploadPreview
                  onUpload={handleFile}
                  onUploadImage={handleUploadImage}
                />
              </div>
              <div className="flex pt-4 justify-content-end">
                <Button
                  label="下一步"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => {
                    setIsUploadImage(false);
                    stepperRef.current.nextCallback();
                  }}
                  className="ml-auto"
                  disabled={!isUploadImage}
                />
              </div>
            </StepperPanel>
            <StepperPanel header="裁切">
              <div className="flex flex-column h-12rem">
                <Cropper
                  src={image}
                  style={{ height: 500, width: "100%" }}
                  ref={inputRef}
                  initialAspectRatio={1 / 1}
                  aspectRatio={1}
                  dragMode={true}
                  guides={false}
                  viewMode={1}
                  zoomTo={0.1}
                  autoCropArea={1}
                  responsive={true}
                  checkOrientation={false}
                  center={false}
                />
                <style>{`
                  .cropper-bg {
                    background: var(--gray-900);
                  }
                  .cropper-crop-box, .cropper-view-box {
                    border-radius: 50%;
                  }
                `}</style>
              </div>
              <div className="flex pt-4 justify-content-between">
                <Button
                  label="重新選擇"
                  severity="secondary"
                  icon="pi pi-arrow-left"
                  onClick={() => stepperRef.current.prevCallback()}
                />
                <Button
                  label="更換"
                  severity="secondary"
                  icon="pi pi-check"
                  onClick={onCrop}
                  autoFocus
                  className="ml-auto"
                />
              </div>
            </StepperPanel>
          </Stepper>
        </div>
      </Dialog>
    </>
  );
}

export default AvatarUploadAndCrop;
