import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { CiSearch } from "react-icons/ci";
import "./JobList.css";
const employmentTypesList = [
  {
    label: "Full Time",
    employmentTypeId: "Full Time",
  },
  {
    label: "Part Time",
    employmentTypeId: "Part Time",
  },
  {
    label: "Freelance",
    employmentTypeId: "Freelance",
  },
  {
    label: "Internship",
    employmentTypeId: "Internship",
  },
];

const salaryRangesList = [
  {
    salaryRangeId: "10LPA",
    label: "10 LPA and above",
  },
  {
    salaryRangeId: "20LPA",
    label: "20 LPA and above",
  },
  {
    salaryRangeId: "30LPA",
    label: "30 LPA and above",
  },
  {
    salaryRangeId: "40LPA",
    label: "40 LPA and above",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

export default function JobList() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [jobLists, setJobLists] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [activeEmploymentId, setActiveEmploymentIds] = useState("");
  const [activeSalaryId, setActiveSalaryId] = useState("");
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const handleEmployementChange = (id) => {
    setActiveEmploymentIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((item) => item !== id)
        : [...prevIds, id]
    );
  };

  const handleSalaryRange = (id) => {
    setActiveSalaryId(id);
  };

  useEffect(() => {
    const getJobList = async () => {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        const apiUrl = `http://localhost:8080/posts?employment_type=${activeEmploymentId}&minimum_package=${activeSalaryId}&search=${searchInput}`;

        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data, "data");

        if (response.ok) {
          const updatedData = data.map((job) => ({
            id: job.id,
            title: job.title,
            companyLogoUrl: job.company_logo_url,
            employmentType: job.employment_type,
            jobDescription: job.job_description,
            location: job.location,
            packagePerAnnum: job.package_per_annum,
            rating: job.rating,
          }));
          setJobLists(updatedData);
          setApiStatus(apiStatusConstants.success);
        }
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    };
    getJobList();
  }, [activeEmploymentId, searchInput, activeSalaryId]);

  console.log(activeEmploymentId);
  const renderSucessView = () => {
    const shouldshowJoblist = jobLists.length > 0;
    return shouldshowJoblist ? (
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {jobLists.map((job) => (
          <Link to={`/jobs/${job.id}`}>
            <p key={job.id} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg  xl:aspect-h-8 xl:aspect-w-7">
                <img
                  src={job.companyLogoUrl}
                  alt={job.title}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-1 text-lg font-medium text-gray-900 pt-2">
                {job.title}
              </h3>
              <h3 className="mt-4 text-sm text-gray-700">
                {job.jobDescription}
              </h3>
              <p className="mt-4 text-sm text-gray-700">
                Employment : {job.employmentType}
              </p>
              <p className="mt-4 text-sm text-gray-700">
                Location : {job.location}
              </p>
              <p className="mt-4 text-sm text-gray-700">
                Package : {job.packagePerAnnum}
              </p>
              <p className="mt-4 text-sm text-gray-700">
                Rating : {job.rating}
              </p>
            </p>
          </Link>
        ))}
      </div>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    );
  };

  const renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <Link to="/jobs">
        <button>Retry</button>
      </Link>
    </div>
  );

  const renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <div className="loader"></div>
    </div>
  );

  const renderJobListView = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderSucessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          className="relative z-40 sm:hidden"
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4">
                <Disclosure
                  as="div"
                  key="employmentType"
                  className="border-t border-gray-200 px-4 py-6"
                >
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <DisclosureButton className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                          <span className="font-medium text-gray-900">
                            Employment Type
                          </span>
                          <span className="ml-6 flex items-center">
                            <ChevronDownIcon
                              className={classNames(
                                open ? "-rotate-180" : "rotate-0",
                                "h-5 w-5 transform"
                              )}
                              aria-hidden="true"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pt-6">
                        <div className="space-y-6">
                          {employmentTypesList.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-mobile-${option.employmentTypeId}-${optionIdx}`}
                                name={`${option.label}[]`}
                                defaultValue={option.label}
                                type="checkbox"
                                checked={activeEmploymentId.includes(
                                  option.employmentTypeId
                                )}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onChange={() =>
                                  handleEmployementChange(
                                    option.employmentTypeId
                                  )
                                }
                              />
                              <label
                                htmlFor={`filter-mobile-${option.employmentTypeId}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-500"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
                <Disclosure
                  as="div"
                  key="salaryRange"
                  className="border-t border-gray-200 px-4 py-6"
                >
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <DisclosureButton className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                          <span className="font-medium text-gray-900">
                            Salary Range
                          </span>
                          <span className="ml-6 flex items-center">
                            <ChevronDownIcon
                              className={classNames(
                                open ? "-rotate-180" : "rotate-0",
                                "h-5 w-5 transform"
                              )}
                              aria-hidden="true"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pt-6">
                        <div className="space-y-6">
                          {salaryRangesList.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-mobile-${option.salaryRangeId}-${optionIdx}`}
                                name={`${option.label}[]`}
                                defaultValue={option.label}
                                type="radio"
                                defaultChecked={option.checked}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onChange={() =>
                                  handleSalaryRange(option.salaryRangeId)
                                }
                              />
                              <label
                                htmlFor={`filter-mobile-${option.salaryRangeId}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-500"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main>
          {/* Filters */}
          <section aria-labelledby="filter-heading">
            <h2 id="filter-heading" className="sr-only">
              Filters
            </h2>

            <div className="border-b border-gray-200 bg-white pb-4 pt-2">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Menu as="div" className="relative inline-block text-left">
                  <div className="search-container">
                    <CiSearch />
                    <input
                      type="text"
                      placeholder="search"
                      className="search-input"
                      onChange={handleSearchInput}
                    />
                  </div>
                </Menu>

                <button
                  type="button"
                  className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  Filters
                </button>

                <div className="hidden sm:block">
                  <div className="flow-root filter-container">
                    <PopoverGroup className="-mx-4 flex items-center divide-x divide-gray-200">
                      <Popover
                        key="employmentType"
                        className="relative inline-block px-4 text-left"
                      >
                        <PopoverButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                          <span className="ml-1.5 rounded px-1.5 py-0.5 text-md font-semibold tabular-nums text-gray-700">
                            Employment Type
                          </span>

                          <ChevronDownIcon
                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                        </PopoverButton>

                        <PopoverPanel
                          transition
                          className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <form className="space-y-4">
                            {employmentTypesList.map((option, optionIdx) => (
                              <div
                                key={`${option.employmentTypeId}-${optionIdx}`}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${option.employmentTypeId}-${optionIdx}`}
                                  name={`${option.label}[]`}
                                  defaultValue={option.label}
                                  type="checkbox"
                                  checked={activeEmploymentId.includes(
                                    option.employmentTypeId
                                  )}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  onChange={() =>
                                    handleEmployementChange(
                                      option.employmentTypeId
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`filter-${option.employmentTypeId}-${optionIdx}`}
                                  className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </form>
                        </PopoverPanel>
                      </Popover>
                    </PopoverGroup>
                    <PopoverGroup className="-mx-4 flex items-center divide-x divide-gray-200">
                      <Popover
                        key="salaryRange"
                        className="relative inline-block px-4 text-left"
                      >
                        <PopoverButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                          <span className="ml-1.5 rounded px-1.5 py-0.5 text-md font-semibold tabular-nums text-gray-700">
                            Salary Range
                          </span>

                          <ChevronDownIcon
                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                        </PopoverButton>

                        <PopoverPanel
                          transition
                          className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <form className="space-y-4">
                            {salaryRangesList.map((option, optionIdx) => (
                              <div
                                key={`${option.salaryRangeId}-${optionIdx}`}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${option.salaryRangeId}-${optionIdx}`}
                                  name={`${option.label}[]`}
                                  defaultValue={option.label}
                                  type="radio"
                                  checked={
                                    activeSalaryId === option.salaryRangeId
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  onChange={() =>
                                    handleSalaryRange(option.salaryRangeId)
                                  }
                                />
                                <label
                                  htmlFor={`filter-${option.salaryRangeId}-${optionIdx}`}
                                  className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </form>
                        </PopoverPanel>
                      </Popover>
                    </PopoverGroup>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Product grid */}
          <section
            aria-labelledby="products-heading"
            className="mx-auto max-w-2xl px-4 pb-16 pt-5 sm:px-6 sm:pb-24 sm:pt-16 lg:max-w-7xl lg:px-8"
          >
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>
            {renderJobListView()}
          </section>
        </main>
      </div>
    </div>
  );
}
