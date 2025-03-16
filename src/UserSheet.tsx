import { useState, useEffect } from "react";
import { dbService } from "./services/api";
import { UserActivitySummary } from "./services/api/dbService";
import logger from "./utils/logger";

const MY_USER_ID = import.meta.env.VITE_MY_USER_ID;

const componentLogger = logger.component("UserSheet");

function UserSheet() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activitySummary, setActivitySummary] =
    useState<UserActivitySummary | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      componentLogger.info("Fetching user stats");

      try {
        setLoading(true);
        const data = await dbService.getUserActivitySummary(MY_USER_ID);

        componentLogger.info("Fetched user activity summary", {
          activities: data.activities.length,
          dates: data.dates.length,
        });

        setActivitySummary(data);
        setError(null);
      } catch (err) {
        componentLogger.error("Failed to fetch stats", err);
        setError("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!activitySummary) return <div>No data available</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Activity Log for {activitySummary.full_name}
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 sticky left-0 bg-gray-100">
                Date
              </th>
              {activitySummary.activities.map((activity) => (
                <th key={activity} className="border border-gray-300 px-4 py-2">
                  {activity}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activitySummary.dates.map((date) => (
              <tr key={date}>
                <td className="border border-gray-300 px-4 py-2 font-medium sticky left-0 bg-white">
                  {new Date(date).toLocaleDateString()}
                </td>
                {activitySummary.activities.map((activity) => {
                  const dateData = activitySummary.data[date] || {};
                  const value = dateData[activity] || 0;

                  return (
                    <td
                      key={`${date}-${activity}`}
                      className={`border border-gray-300 px-4 py-2 text-center ${value ? "bg-blue-50" : ""}`}
                    >
                      {value ? `${value} min` : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Summary</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {activitySummary.activities.map((activity) => {
            const totalMinutes = activitySummary.dates.reduce((sum, date) => {
              const dateData = activitySummary.data[date] || {};
              return sum + (dateData[activity] || 0);
            }, 0);

            return (
              <div key={activity} className="bg-gray-50 p-3 rounded">
                <span className="font-medium">{activity}:</span> {totalMinutes}{" "}
                minutes total
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UserSheet;
