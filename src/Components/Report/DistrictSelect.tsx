import React from "react";
import { userService } from "../../service/user.service";
import { Spinner } from "./LoaderComponents";
import { ErrorMessage } from "./ErrorComponents";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

interface Props {
  selected: number | null;
  onChange: (id: number, name?: string) => void;
  disabled?: boolean;
}

export const DistrictSelect: React.FC<Props> = ({ selected, onChange, disabled }) => {

    // const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);

  const [districts, setDistricts] = React.useState<{ district_id: number; district_name: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDistricts = async () => {
    if(!token){
      toast.error("token not found");
    }
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getAllDistrict(token);
      if (res.success) {
        setDistricts(res.data);
      } else {
        setError("Failed to load districts");
      }
    } catch (err) {
      setError("Network error while loading districts");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDistricts();
  }, []);

  if (loading) {
    return (
      <div className="relative">
        <div className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-2">
          <Spinner size="sm" />
          <span className="text-sm text-gray-600">Loading districts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <ErrorMessage message={error} onRetry={fetchDistricts} />
      </div>
    );
  }

  const selectedDistrict = districts.find(d => d.district_id === selected);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Select District</label>
      
      <div className="relative">
        <select
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white appearance-none cursor-pointer"
          value={selected || ""}
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const selectedDistrict = districts.find(d => d.district_id === selectedId);
            onChange(selectedId, selectedDistrict?.district_name || "");
          }}
          disabled={disabled}
        >
          <option value="">Choose district...</option>
          {districts.map((d) => (
            <option key={d.district_id} value={d.district_id}>
              {d.district_name}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {selectedDistrict && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
          <span className="text-xs text-orange-700">✓ {selectedDistrict.district_name}</span>
        </div>
      )}
    </div>
  );
};