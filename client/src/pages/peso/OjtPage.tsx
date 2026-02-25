import ProgramPage from "./ProgramPage";

export default function OjtPage() {
  return (
    <ProgramPage
      programKey="ojt"
      title="OJT Program"
      description="On-the-Job Training program enrollments"
      endpoint="/peso/ojt"
      extraColumns={[
        { key: "company", header: "Company", render: (r: any) => r.company ?? "--" },
        { key: "totalHours", header: "Hours", render: (r: any) => r.totalHours ?? "--" },
      ]}
    />
  );
}
