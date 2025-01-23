import Announcements from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";
import OverviewBoxContainerProducer from "@/components/OverviewBoxProducerContainer";

const ProducerPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <h1 className="font-semibold gap-8 p-2">Dashboard</h1>
        {/* USER CARDS */}
        <OverviewBoxContainerProducer />

        <div className="flex gap-4 justify-between flex-wrap"></div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row"></div>
        {/* BOTTOM CHART */}
        <div className="w-full flex flex-col gap-2"></div>
        <div className="w-full h-[500px]"></div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default ProducerPage;
