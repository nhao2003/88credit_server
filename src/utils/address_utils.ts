import fs from 'fs';
import path from 'path';
type Province = {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code: number;
};
type District = {
  province_code: number;
  name: string;
  code: number;
  division_type: string;
  short_codename: string;
};
type Ward = {
  province_code: number;
  district_code: number;
  name: string;
  code: number;
  division_type: string;
  short_codename: string;
};
class AddressUtils {
  private provinces: Record<number, Province> = {};
  private districts: Record<number, Record<number, District>> = {};
  private wards: Record<number, Record<number, Record<number, Ward>>> = {};
  constructor() {
    const address = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'address.json'), 'utf8'));
    address.forEach((province: any) => {
      const province_code = province.code;
      this.provinces[province_code] = {
        name: province.name,
        code: province_code,
        codename: province.codename,
        division_type: province.division_type,
        phone_code: province.phone_code,
      };
      this.districts[province_code] = {};
      province.districts.forEach((district: any) => {
        const district_code = district.code;
        this.districts[province_code][district_code] = {
          province_code,
          name: district.name,
          code: district_code,
          division_type: district.division_type,
          short_codename: district.short_codename,
        };
        this.wards[province_code] = this.wards[province_code] || {};
        this.wards[province_code][district_code] = {};
        district.wards.forEach((ward: any) => {
          this.wards[province_code][district_code][ward.code] = {
            province_code,
            district_code,
            name: ward.name,
            code: ward.code,
            division_type: ward.division_type,
            short_codename: ward.short_codename,
          };
        });
      });
    });
  }
  public getProvince = (code: number): Province | null => {
    return this.provinces[code] || null;
  };
  public getDistrict(province_code: number, district_code: number): District | null {
    return (this.districts[province_code] || {})[district_code] || null;
  }
  public getWard(province_code: number, district_code: number, ward_code: number): Ward | null {
    return ((this.wards[province_code] || {})[district_code] || {})[ward_code] || null;
  }

  public getProvinces(): Province[] {
    return Object.values(this.provinces);
  }
  public getDistricts(province_code: number): District[] {
    return Object.values(this.districts[province_code] || {});
  }
  public getWards(province_code: number, district_code: number): Ward[] {
    return Object.values((this.wards[province_code] || {})[district_code] || {});
  }
  public getDetailedAddress(province_code: number, district_code: number, ward_code: number): string | null {
    const province = this.getProvince(province_code);
    const district = this.getDistrict(province_code, district_code);
    const ward = this.getWard(province_code, district_code, ward_code);
    if (!province || !district || !ward) {
      return null;
    }
    const val = `${ward.name}, ${district.name}, ${province.name}`;
    return val;
  }

  private static instance: AddressUtils;
  public static getInstance(): AddressUtils {
    if (!AddressUtils.instance) {
      AddressUtils.instance = new AddressUtils();
    }
    return AddressUtils.instance;
  }
}
export default AddressUtils.getInstance();
