const FooterMenus = ({
  id,
  label,
  value,
  onValueChange,
  uniqueHtmlId,
  menus,
  isLoading,
}) => {
  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selectedMenu = menus.find((menu) => menu._id === selectedId);
    onValueChange(selectedMenu);
  };

  return (
    <select
      id={uniqueHtmlId}
      className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
      value={isLoading ? "" : value?._id || ""}
      onChange={handleSelectChange}
    >
      {isLoading ? (
        <option value="" disabled>
          Loading...
        </option>
      ) : (
        <>
          <option value="" disabled>
            Select a menu
          </option>
          {menus.map((menu) => (
            <option key={menu._id} value={menu._id}>
              {menu.title}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default FooterMenus;
