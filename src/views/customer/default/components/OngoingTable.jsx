import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";

const OngoingTable = () => {
  return (
    <>
      <Card className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <h1 className="align-self-center mb-3 font-bold sm:text-2xl">
          Ongoing Trip
        </h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block w-full p-1.5 align-middle">
              <div className="overflow-hidden rounded-lg border">
                <ScrollPanel
                  style={{ width: "100%", height: "350px" }}
                  className="custombar1"
                >
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="flex items-center px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                        >
                          Sr.No
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 13l-5 5m0 0l-5-5m5 5V6"
                            />
                          </svg>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                        >
                          <span className="inline-flex items-center">
                            Vehicle Name
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 11l5-5m0 0l5 5m-5-5v12"
                              />
                            </svg>
                          </span>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                        >
                          <span className="inline-flex items-center">
                            Start Time
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 13l-5 5m0 0l-5-5m5 5V6"
                              />
                            </svg>
                          </span>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-500 "
                        >
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                          1
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          Jone Doe
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          03-12-2023 11:56:30 AM
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                          >
                            Map
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                          2
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          Jone Doe
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          03-12-2023 08:36:30 AM
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                          >
                            Map
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                          2
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          Jone Doe
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          03-12-2023 08:36:30 AM
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                          >
                            Map
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                          2
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          Jone Doe
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          03-12-2023 08:36:30 AM
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                          >
                            Map
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                          2
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          Jone Doe
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          03-12-2023 08:36:30 AM
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                          >
                            Map
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                          2
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          Jone Doe
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          03-12-2023 08:36:30 AM
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                          >
                            Map
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                          2
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          Jone Doe
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          03-12-2023 08:36:30 AM
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                          >
                            Map
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                          2
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          Jone Doe
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          03-12-2023 08:36:30 AM
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                          >
                            Map
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                          2
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          Jone Doe
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                          03-12-2023 08:36:30 AM
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            className="text-green-500 hover:text-green-700"
                            href="#"
                          >
                            Map
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollPanel>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default OngoingTable;
