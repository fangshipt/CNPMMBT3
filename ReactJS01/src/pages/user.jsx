import { notification, Table, Tag } from "antd";

import { useEffect, useState } from "react";

import { getUserApi } from "../util/api";

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();

            if (res && Array.isArray(res)) {
                setDataSource(res);
            } else if (res?.EC === 0 && Array.isArray(res.data)) {
                setDataSource(res.data);
            } else {
                notification.error({
                    message: "Không tải được dữ liệu",
                    description: res?.EM || res?.message || "Bạn thử tải lại trang sau ít phút nhé."
                });
            }
        };

        fetchUser();
    }, []);

    const columns = [
        {
            title: 'Mã người dùng',
            dataIndex: '_id',
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            render: (name) => name || "Chưa cập nhật",
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            render: (role) => <Tag color="gold">{role || "Người dùng"}</Tag>,
        }
    ];

    return (
        <div className="user-page">
            <h1>Danh sách người dùng</h1>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey={"_id"}
                pagination={{
                    pageSize: 6,
                    showSizeChanger: false,
                }}
            />
        </div>
    )
}

export default UserPage;
