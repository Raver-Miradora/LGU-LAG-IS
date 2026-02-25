import ProgramPage from "./ProgramPage";

export default function SpesPage() {
  return (
    <ProgramPage
      programKey="spes"
      title="SPES Program"
      description="Special Program for Employment of Students"
      endpoint="/peso/spes"
      extraColumns={[
        { key: "school", header: "School", render: (r: any) => r.school ?? "--" },
        { key: "yearLevel", header: "Year Level", render: (r: any) => r.yearLevel ?? "--" },
      ]}
    />
  );
}
