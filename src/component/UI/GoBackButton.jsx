import { Button } from "primereact/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function GoBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const handleGoBack = () => {
    navigate(-1); // 返回上一頁
  };

  useEffect(() => {
    // 檢查是否有上一頁，並且上一頁是否屬於同一域名
    const isSameDomain = window.history.state !== null;

    if (window.history.length > 1 && isSameDomain) {
      setHasPreviousPage(true);
    } else {
      setHasPreviousPage(false);
    }
  }, [location]);

  return (
    <>
      {hasPreviousPage && (
        <Button
          icon="pi pi-arrow-left"
          className="go-back-button"
          size="small"
          text
          rounded
          onClick={handleGoBack}
        />
      )}
    </>
  );
}

export default GoBackButton;