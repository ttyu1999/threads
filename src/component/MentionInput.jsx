import { useEffect, useState } from "react";
import { Avatar } from "primereact/avatar";
import axios from "axios";
import { Mention } from "primereact/mention";

function MentionInput({ inputRef, rows = 5, defaultValue = null, id = null, ...props }) {
  const [customers, setCustomers] = useState([]);
  const [multipleSuggestions, setMultipleSuggestions] = useState([]);
  const tagSuggestions = ["迷宮飯", "勇者欣梅爾", "小豬佩奇", "前端工程師", "4090顯卡", "單身即地獄", "妙廚老媽", "Supernova", "ABCD", "TWICE", "IKEA念法", "腦筋急轉彎2", "育兒日記", "澳洲打工",];
  const [isPanelTop, setIsPanelTop] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://social-media-api-demo.fly.dev/api/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      } 
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  });

  useEffect(() => {
    const textareaHeight = inputRef.current.getInput().offsetHeight;
    const rect = inputRef.current.getInput().getBoundingClientRect();
    const panelHeight = 200;
    if (
      rect.top + textareaHeight + rect.height + panelHeight >
      window.innerHeight
    ) return setIsPanelTop(true);
    
    return setIsPanelTop(false);
  }, [inputRef, setIsPanelTop]);

  const onMultipleSearch = (event) => {
    const trigger = event.trigger;

    if (trigger === "@") {
      const query = event.query;
      let suggestions;

      if (!query.trim().length) {
        suggestions = customers.map((customer) => ({
          ...customer,
          displayName: customer.nickName || customer.userName,
        }));
      } else {
        suggestions = customers
          .filter(
            (customer) =>
              (customer.nickName &&
                customer.nickName
                  .toLowerCase()
                  .startsWith(query.toLowerCase())) ||
              (customer.userName &&
                customer.userName.toLowerCase().startsWith(query.toLowerCase()))
          )
          .map((customer) => ({
            ...customer,
            displayName: customer.nickName || customer.userName,
          }));
      }

      setMultipleSuggestions(suggestions);
    } else if (trigger === "#") {
      const query = event.query;
      let suggestions;

      if (!query.trim().length) {
        suggestions = [...tagSuggestions];
      } else {
        suggestions = tagSuggestions.filter((tag) => {
          return tag.toLowerCase().startsWith(query.toLowerCase());
        });
      }

      setMultipleSuggestions(suggestions);
    }
  };

  const itemTemplate = (suggestion) => {
    return (
      <div className="flex align-items-center w-auto">
        <Avatar
          icon="pi pi-user"
          image={suggestion.avatar}
          size="large"
          shape="circle"
          className="overflow-hidden"
          pt={{ image: { className: "object-cover" } }}
        />
        <span className="flex flex-col ml-2">
          {suggestion.nickName ?? suggestion.userName}
          <small
            style={{ fontSize: ".75rem", color: "var(--text-color-secondary)" }}
          >
            @{suggestion.email}
          </small>
        </span>
      </div>
    );
  };

  const multipleItemTemplate = (suggestion, options) => {
    const trigger = options.trigger;

    if (trigger === "@" && (suggestion.nickName || suggestion.userName)) {
      return itemTemplate(suggestion);
    } else if (
      trigger === "#" &&
      !(suggestion.nickName || suggestion.userName)
    ) {
      return <span>{suggestion}</span>;
    }

    return null;
  };

  return (
    <>
      <Mention
        {...props}
        ref={inputRef}
        trigger={["@", "#"]}
        suggestions={multipleSuggestions}
        onSearch={onMultipleSearch}
        field={["displayName"]}
        placeholder="使用 @ 及 # 標註"
        itemTemplate={multipleItemTemplate}
        rows={rows}
        className="w-full"
        pt={{
          root: {
            className: "w-full",
            value: null,
            placeholder: null,
            rows: null,
          },
          input: {
            id: id,
            className:
              "resize-none w-full max-h-[60vh] border-0 bg-[var(--surface-50)]",
          },
          panel: { className: `min-w-fit ${isPanelTop ? "panel-top" : ""}` },
        }}
        transitionOptions={{
          classNames: "p-dialog",
          timeout: { enter: 300, exit: 100 },
        }}
      />
      <style>{`.border-0 { border-width: 0px; }`}</style>
    </>
  );
}

export default MentionInput;
