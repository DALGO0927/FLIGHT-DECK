import { FC, useEffect, useState } from "react";
import FormPhoto from "./form/formphoto";
import FromInstructor from "./form/forminstructor";
import FormPassword from "./form/formpassword";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/userStore";
import ProtectedRoute from "../components/AuxComponents/ProtectedRoute";
import ToasterProvider from "../providers/ToasterProvider";
import FormCertificates from "./form/formCertificates";
import Loader from "../components/Loader";
import StatsInstructor from "../components/AuxComponents/Stats/StatsInstructor";

const DashboardInstructor: FC = () => {
  const { data } = useSession();

  const { user, fetchUserByEmail } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showFormInstructor, setShowFormInstructor] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

    // Toggle this state to re-render charts
    // By changing this state variable a re-render of the page is issued
  const [rerenderCharts, setRerenderCharts] = useState(false);

  const toggleRerenderCharts = () => {
    setRerenderCharts(!rerenderCharts);
  }


  const handleFormInstructor = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setShowInfo(false);
    setShowFormInstructor(true);
  };

  const handleFormPassword = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setShowInfo(false);
    setShowFormPassword(true);
  };

  const handleCertifications = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setShowInfo(false);
    setShowCertificates(true);
  };

  useEffect(() => {
    setIsLoading(true);
    if (data?.user?.email) {
      console.log(data.user.email);
      const email = data.user.email;
      fetchUserByEmail(email);
    }
    setIsLoading(false);
  }, [data]);

  return (
    //<ProtectedRoute allowedRoles={['INSTRUCTOR']}>
    <div
      className="min-h-screen bg-gray-100 w-full"
      style={{
        backgroundImage: "url('/images/DASHCOMPANY.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isLoading && <Loader />}
      {user?.id && (
        <main>
          <ToasterProvider />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="bg-white bg-opacity-70 rounded-lg shadow-lg p-6 w-11/12  md:w-4/5 justify-center">
                <h2 className="text-xl font-bold mb-10 w-full text-center">
                  INSTRUCTOR INFORMATION
                </h2>
                <div className="flex flex-col lg:flex-row gap-4 max-w-full items-center ">
                  <div className="flex flex-col lg:flex-row w-full mr-2">
                    <div className="mx-auto h-auto mb-10 w-3/5 lg:max-w-4/5">
                      <FormPhoto />
                    </div>
                    {showInfo && (
                      <div className="flex flex-col text-xl text-center lg:text-left ml-2">
                        <p className="font-bold text-2xl">{user.name}</p>
                        <p className="font-bold text-2xl">{user.lastName}</p>
                        <p className="font-semibold italic mb-2 mt-6">
                          {user.email}
                        </p>
                        <p className="font-semibold italic mb-2 mt-6 flex">
                          <p className="font-normal mr-2 not-italic">
                            Nacionality:{" "}
                          </p>
                          {user.nationality}
                        </p>
                        <p className="font-semibold italic mb-2 mt-2 flex">
                          <p className="font-normal mr-2 not-italic">City: </p>{" "}
                          {user.city}
                        </p>
                        <p className="font-semibold italic mb-2 mt-2 flex">
                          <p className="font-normal mr-2 not-italic">
                            Address:{" "}
                          </p>
                          {user.address}
                        </p>
                        <p className="font-semibold italic mb-2 mt-2 flex">
                          <p className="font-normal mr-2 not-italic">Phone: </p>
                          {user.phoneNumber}
                        </p>
                        <button
                          className="font-sans bg-flightdeck-black text-flightdeck-lightgold mt-4 rounded-md py-2 hover:bg-flightdeck-darkgold hover:text-black border hover:border-black"
                          onClick={handleFormInstructor}
                        >
                          Edit Information
                        </button>
                        <button
                          className="font-sans bg-flightdeck-black text-flightdeck-lightgold my-4 rounded-md py-2 hover:bg-flightdeck-darkgold hover:text-black border hover:border-black"
                          onClick={handleCertifications}
                        >
                          Edit Certifications
                        </button>
                        <button
                          className="font-sans bg-flightdeck-black text-flightdeck-lightgold  rounded-md py-2 hover:bg-flightdeck-darkgold hover:text-black border hover:border-black"
                          onClick={handleFormPassword}
                        >
                          Change Password
                        </button>
                      </div>
                    )}
                  </div>
                  {showFormInstructor && (
                    <div className="mx-auto h-auto mb-10 w-full lg:w-4/5">
                      <FromInstructor
                        setShowInfo={setShowInfo}
                        setShowFormInstructor={setShowFormInstructor}
                      />
                    </div>
                  )}
                  {showFormPassword && (
                    <div className="mx-auto h-auto mb-10 w-full lg:w-4/5">
                      <FormPassword
                        setShowInfo={setShowInfo}
                        setShowFormPassword={setShowFormPassword}
                      />
                    </div>
                  )}
                  {/* CERTIFICADOS */}
                  {showCertificates && (
                    <FormCertificates
                      setShowInfo={setShowInfo}
                      setShowCertificates={setShowCertificates}
                      userId={user.id}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 mx-auto max-w-full px-4 sm:px-6 lg:px-8">
              <StatsInstructor userId={user.id} toggleRerenderCharts={toggleRerenderCharts} />
            </div>
          </div>
        </main>
      )}
    </div>
    //</ProtectedRoute>
  );
};

export default DashboardInstructor;
