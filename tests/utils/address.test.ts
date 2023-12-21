import addressUtils from '../../src/utils/address_utils';

describe('AddressUtils', () => {
  describe('getProvinces', () => {
    it('should return all provinces', () => {
      const result = addressUtils.getProvinces();
      expect(result.length).toEqual(63);
    });
  });
  describe('getProvince', () => {
    it('should return null for non-existent province code', () => {
      const result = addressUtils.getProvince(0);
      expect(result).toBeNull();
    });

    it('should return the correct province for a valid province code', () => {
      const result = addressUtils.getProvince(1);
      expect(result).toEqual({
        name: 'Thành phố Hà Nội',
        code: 1,
        codename: 'thanh_pho_ha_noi',
        division_type: 'thành phố trung ương',
        phone_code: 24,
      });
    });
    it('should return the correct province for a valid province code', () => {
      const result = addressUtils.getProvince(96);
      expect(result).toEqual({
        name: 'Tỉnh Cà Mau',
        code: 96,
        codename: 'tinh_ca_mau',
        division_type: 'tỉnh',
        phone_code: 290,
      });
    });
    it('should return the correct province for a valid province code', () => {
      const result = addressUtils.getProvince(60);
      expect(result).toEqual({
        name: 'Tỉnh Bình Thuận',
        code: 60,
        codename: 'tinh_binh_thuan',
        division_type: 'tỉnh',
        phone_code: 252,
      });
    });

    // All districts in a province has the same province code
    it('All districts, wards in a province has the same province code', () => {
      const result = addressUtils.getProvinces();
      result.forEach((province) => {
        const districts = addressUtils.getDistricts(province.code);
        districts.forEach((district) => {
          expect(district.province_code).toEqual(province.code);
          const wards = addressUtils.getWards(province.code, district.code);
          wards.forEach((ward) => {
            expect(ward.province_code).toEqual(province.code);
          });
        });
      });
    });

    it('Return empty array for non-existent district code', () => {
      const result = addressUtils.getDistricts(0);
      expect(result).toEqual([]);
    });
    it('Return null for non-existent district code', () => {
      const result = addressUtils.getDistrict(0, 0);
      expect(result).toBeNull();
    });

    it('Return empty array for non-existent ward code', () => {
      const result = addressUtils.getWards(0, 1);
      expect(result).toEqual([]);
    });

    it('Return null for non-existent ward code', () => {
      const result = addressUtils.getWard(1, 1, 0);
      expect(result).toBeNull();
    });

    it('Return null for non-existent ward code', () => {
      const result = addressUtils.getWard(1, 0, 1);
      expect(result).toBeNull();
    });

    it('Return null for non-existent ward code', () => {
      const result = addressUtils.getWard(0, 1, 1);
      expect(result).toBeNull();
    });

    it('Return null for non-existent ward code', () => {
      const result = addressUtils.getWard(0, 0, 1);
      expect(result).toBeNull();
    });

    it('Return null for non-existent ward code', () => {
      const result = addressUtils.getWard(0, 0, 0);
      expect(result).toBeNull();
    });

    it('Return null for non-existent ward code', () => {
      const result = addressUtils.getWard(0, 1, 0);
      expect(result).toBeNull();
    });

    it('Return null for non-existent ward code', () => {
      const result = addressUtils.getWard(1, 0, 0);
      expect(result).toBeNull();
    });

    it('Return detailed address for a valid province, district, ward code', () => {
      const result = addressUtils.getDetailedAddress(1, 1, 1);
      expect(result).toEqual('Phường Phúc Xá, Quận Ba Đình, Thành phố Hà Nội');
    });

    it('Return detailed address for a valid province, district, ward code', () => {
      const result = addressUtils.getDetailedAddress(1, 1, 2);
      expect(result).toEqual(null);
    });

    it('Return detailed address for a valid province, district, ward code', () => {
      const result = addressUtils.getDetailedAddress(1, 1, 4);
      expect(result).toEqual('Phường Trúc Bạch, Quận Ba Đình, Thành phố Hà Nội');
    });
  });
});
