import * as addressService from '../services/addressService.js';

export const getAddresses = async (req, res) => {
    try {
        const addresses = await addressService.getAddressesService(req.user.id);
        return res.json({ EC: 0, EM: 'success', data: addresses });
    } catch (e) {
        return res.status(500).json({ EC: -1, EM: e.message });
    }
};

export const createAddress = async (req, res) => {
    try {
        const address = await addressService.createAddressService(req.user.id, req.body);
        return res.status(201).json({ EC: 0, EM: 'Đã thêm địa chỉ', data: address });
    } catch (e) {
        return res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const address = await addressService.updateAddressService(req.user.id, req.params.id, req.body);
        return res.json({ EC: 0, EM: 'Đã cập nhật địa chỉ', data: address });
    } catch (e) {
        return res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        await addressService.deleteAddressService(req.user.id, req.params.id);
        return res.json({ EC: 0, EM: 'Đã xóa địa chỉ' });
    } catch (e) {
        return res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const setDefaultAddress = async (req, res) => {
    try {
        const address = await addressService.setDefaultAddressService(req.user.id, req.params.id);
        return res.json({ EC: 0, EM: 'Đã đặt làm địa chỉ mặc định', data: address });
    } catch (e) {
        return res.status(400).json({ EC: 1, EM: e.message });
    }
};
