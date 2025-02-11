"use client";

import { useEffect, useState } from "react";

interface Props {
  id: string | string[] | undefined;
  type: string;
}

const Provider = ({ id, type }: Props) => {
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [streamingData, setStreamingData] = useState<any>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await fetch("/api/location");
        const locationData = await location.json();
        setCountryCode(locationData.country);
        console.log(countryCode);

        if (locationData) {
          const response = await fetch(`/api/provider?id=${id}&type=${type}`);
          const data = await response.json();
          const streaming = data.results[locationData.country];

          setStreamingData(streaming);

          if (!streaming) {
            setError("Not Available For Streaming");
          }
        }
      } catch (error) {
        console.error("API ERROR:", error);
      }
    };

    fetchLocation();
  }, [id]);

  return (
    <div className="p-6  text-white">
      <div className="my-6">
        <h1 className="text-4xl font-sans font-bold">Watch Now</h1>
      </div>

      <div>
        {error ? (
          <div className=" text-red-500 font-semibold">{error}</div>
        ) : (
          <div>
            {/* Stream Section */}
            {streamingData?.flatrate && (
              <div className="flex bg-[#121422] mt-0 pt-0">
                <h2 className="text-xl mb-[3px] text-[#797a7b]  bg-[#e6e6e6] [writing-mode:vertical-rl] rotate-180  font-semibold py-3 px-1  ">
                  Stream
                </h2>

                <div className="flex ml-5  flex-wrap">
                  {streamingData.flatrate.map(
                    (provider: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col items-center p-4"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="w-[3rem] rounded-xl  mb-2 object-contain"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Rent Section */}
            {streamingData?.rent && (
              <div
                style={{
                  background: "linear-gradient(180deg,#101d29,transparent 65%)",
                }}
                className="flex  mt-0 pt-0"
              >
                <h2 className="text-xl mb-[3px] text-[#797a7b] bg-[#e6e6e6]   [writing-mode:vertical-rl] rotate-180  font-semibold py-3 px-1  ">
                  Rent
                </h2>
                <div className="flex  ml-5 flex-wrap">
                  {streamingData.rent.map((provider: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 rounded-md "
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-[3rem] rounded-xl mb-2 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buy Section */}
            {streamingData?.buy && (
              <div className="flex bg-[#121422]  mt-0 pt-0">
                <h2 className="text-xl bg-[#e6e6e6]  text-[#797a7b] [writing-mode:vertical-rl] rotate-180  font-semibold py-6 px-1 ">
                  Buy
                </h2>
                <div className="flex gap-4 ml-4 flex-wrap">
                  {streamingData.buy.map((provider: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col items-center  p-4"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-[3rem] rounded-xl mb-2 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Provider;
