import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const options = [
  { name: "公開", icon: "pi pi-globe" },
  { name: "朋友", icon: "pi pi-users" },
  { name: "僅限本人", icon: "pi pi-lock" },
];

export default function PostVisibilityMenu() {
  const [selectedView, setSelectedView] = useState(options[0]);

  const selectedTemplate = (option) => {
    if (option) {
      return (
        <>
          <Button
            icon={option.icon}
            label={option.name}
            severity="secondary"
            className="text-xs px-2 py-1 w-full"
            pt={{
              icon: { className: "text-xs mr-1" },
              label: { className: "font-normal text-xs" },
            }}
          />
          <style>{`.py-1 { padding-block: 0.25rem }`}</style>
        </>
      );
    }
  };

  const optionTemplate = (option) => {
    return (
      <div
        className="flex items-center"
      >
        <i className={`${option.icon} text-xs`}></i>
        <span className="ml-2 text-xs">{option.name}</span>
      </div>
    );
  };

  return (
    <>
      <Dropdown
        value={selectedView}
        onChange={(e) => setSelectedView(e.value)}
        options={options}
        optionLabel="name"
        clearIcon
        itemTemplate={optionTemplate}
        valueTemplate={selectedTemplate}
        placeholder="選擇權限"
        pt={{
          root: { className: "w-auto h-full border-0" },
          input: { className: "p-0 justify-start", name: "userSelected" },
          trigger: { className: "w-auto p-1 hidden" },
          select: { name: "userSelected" },
        }}
        transitionOptions={{
          classNames: "p-dialog",
          timeout: { enter: 300, exit: 300 },
        }}
      />
      <style>{`.hidden { display: none; }`}</style>
    </>
  );
}
