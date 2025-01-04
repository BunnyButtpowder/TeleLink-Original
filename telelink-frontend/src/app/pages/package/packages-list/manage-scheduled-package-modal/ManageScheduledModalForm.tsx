import React, { FC, useEffect, useState } from 'react';
import { useTable, ColumnInstance, Row } from 'react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllScheduledFiles, deleteScheduledFile } from '../core/_requests';
import { ScheduledFile } from '../core/_models';

const ManageScheduledModalForm: FC = () => {
  const [scheduledFiles, setScheduledFiles] = useState<ScheduledFile[]>([]);

  useEffect(() => {
    const fetchScheduledFiles = async () => {
      try {
        const response = await getAllScheduledFiles();
        setScheduledFiles(response.data);
      } catch (error) {
        toast.error('Không thể tải danh sách dữ liệu đã lên lịch!');
        console.error('Error fetching scheduled files:', error);
      }
    };

    fetchScheduledFiles();
  }, []);

  const handleDelete = async (dataId: number) => {
    try {
      await deleteScheduledFile(dataId);
      setScheduledFiles((prevFiles) => prevFiles.filter((file) => file.id !== dataId));
      toast.success('Xoá tệp thành công!');
    } catch (error) {
      toast.error('Xoá tệp thất bại!');
      console.error('Error deleting file:', error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Ngày tạo',
        accessor: 'createdAt' as const,
        Cell: ({ value }: { value: string }) => new Date(value).toLocaleString(),
      },
      {
        Header: 'Đường dẫn',
        accessor: 'filePath' as const,
      },
      {
        Header: 'Ngày hiệu lực',
        accessor: 'scheduledDate' as const,
        Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString(),
      },
      // {
      //   Header: 'Người tạo',
      //   accessor: (row: ScheduledFile) => row.user?.fullName || 'Không xác định',
      //   Cell: ({ value }: { value: string }) => <span>{value}</span>,
      // },
      {
        Header: 'Hành động',
        accessor: 'id' as const,
        Cell: ({ value }: { value: number }) => (
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(value)}
          >
            Xoá
          </button>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data: scheduledFiles,
  });

  return (
    <>
      <ToastContainer />
      <div className="table-responsive">
        <table
          id="kt_table_customers"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
          {...getTableProps()}
        >
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              {headers.map((column: ColumnInstance<ScheduledFile>) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<ScheduledFile>, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={`row-${i}-${row.id}`}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="d-flex text-center w-100 align-content-center justify-content-center">
                    Không có dữ liệu
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export { ManageScheduledModalForm };
