import { KTIcon } from "../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
import { ReportListFilter } from "./ReportListFilter";
import { useIntl } from "react-intl";
import { exportReport } from "../../core/_requests";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReportListToolbar = () => {
  const intl = useIntl();
  const { setItemIdForUpdate } = useListView();

  const openAddUserModal = () => {
    setItemIdForUpdate(null);
  };

  const handleExportExcel = async () => {
    try {
      await exportReport();
      toast.success('Xuất báo cáo thành công');
    } catch (error) {
      toast.error('Có lỗi trong quá trình xuất báo cáo: ' + error);
    }
  };

  return (
    <>
    <ToastContainer />
    <div className="d-flex justify-content-end" data-kt-user-table-toolbar="base">
      <ReportListFilter />

      <button
        type="button"
        className="btn btn-info me-3"
        onClick={handleExportExcel}
      >
        <KTIcon iconName="exit-up" className="fs-2" />
        Xuất báo cáo 
      </button>

      {/* Uncomment this if you want the Add User button */}
      {/* <button type="button" className="btn btn-primary" onClick={openAddUserModal}>
        <KTIcon iconName="plus" className="fs-2" />
        {intl.formatMessage({ id: "USERS.MANAGEMENT.ADD_USER" })}
      </button> */}
    </div>
    </>
    
  );
};

export { ReportListToolbar };
