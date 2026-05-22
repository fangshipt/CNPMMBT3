import Address from '../models/address.js';

export const getAddressesService = async (userId) => {
    return Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
};

export const createAddressService = async (userId, data) => {
    const { recipientName, phone, province, district, ward, detail, isDefault } = data;
    if (!recipientName || !phone || !province || !district || !ward || !detail) {
        throw new Error('Vui lòng điền đầy đủ thông tin địa chỉ');
    }
    if (!/^(0|\+84)[0-9]{8,10}$/.test(phone.replace(/\s/g, ''))) {
        throw new Error('Số điện thoại không hợp lệ');
    }

    if (isDefault) {
        await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const count = await Address.countDocuments({ user: userId });
    const address = await Address.create({
        user: userId,
        recipientName,
        phone,
        province,
        district,
        ward,
        detail,
        isDefault: isDefault || count === 0,
    });
    return address;
};

export const updateAddressService = async (userId, addressId, data) => {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) throw new Error('Địa chỉ không tồn tại');

    const { recipientName, phone, province, district, ward, detail, isDefault } = data;

    if (phone && !/^(0|\+84)[0-9]{8,10}$/.test(phone.replace(/\s/g, ''))) {
        throw new Error('Số điện thoại không hợp lệ');
    }

    if (isDefault) {
        await Address.updateMany({ user: userId }, { isDefault: false });
    }

    Object.assign(address, { recipientName, phone, province, district, ward, detail, isDefault });
    await address.save();
    return address;
};

export const deleteAddressService = async (userId, addressId) => {
    const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
    if (!address) throw new Error('Địa chỉ không tồn tại');
    if (address.isDefault) {
        const next = await Address.findOne({ user: userId }).sort({ createdAt: -1 });
        if (next) { next.isDefault = true; await next.save(); }
    }
};

export const setDefaultAddressService = async (userId, addressId) => {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) throw new Error('Địa chỉ không tồn tại');
    await Address.updateMany({ user: userId }, { isDefault: false });
    address.isDefault = true;
    await address.save();
    return address;
};
