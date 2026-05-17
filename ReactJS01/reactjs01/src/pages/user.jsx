import { notification, Table } from "antd";

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
                    message: "Lỗi",
                    description: res?.EM || res?.message || "Không thể tải danh sách người dùng"
                });
            }

        };

        fetchUser();

    }, []);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        }
    ];

    return (
        <div style={{ padding: 30 }}>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey={"_id"}
            />
        </div>
    )
}

export default UserPage;