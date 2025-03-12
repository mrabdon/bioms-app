import Announcements from "@/components/Announcements";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import OverviewBoxContainer from "@/components/OverviewBoxContainer";
import TabContainer from "@/components/TabContainer";

const AdminPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row border bg-white h-screen overflow-hidden">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-8 ">
        <TabContainer />
        <OverviewBoxContainer />

        <div className="w-full flex flex-col gap-2">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* <OverviewCard title="Lifted Overview" items={[]} />
            <OverviewCard title="Unlifted Overview" items={[]} />
            <OverviewCard title="Actual Production Overview" items={[]} /> */}
          </div>

          <div>
            <h1 className="text-2xl gap-4 p-4 font-bold text-gray-800">
              Volume
            </h1>
            {/* <MyBarChart /> */}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8 h-screen">
        <div className="border border-gray-300 rounded-lg p-4">
          <EventCalendarContainer searchParams={searchParams} />
        </div>
        <div className="border border-gray-300 rounded-lg p-4">
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
