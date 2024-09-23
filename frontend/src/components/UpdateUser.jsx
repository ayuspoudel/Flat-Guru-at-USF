

function AccountSettings() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
      <div className="form-control">
        <label className="label" htmlFor="firstName">First Name</label>
        <input className="input input-bordered" type="text" id="firstName" placeholder="Tim" />
      </div>
      <div className="form-control">
        <label className="label" htmlFor="lastName">Last Name</label>
        <input className="input input-bordered" type="text" id="lastName" placeholder="Cook" />
      </div>
      <div className="form-control">
        <label className="label" htmlFor="phoneNumber">Phone Number</label>
        <input className="input input-bordered" type="tel" id="phoneNumber" placeholder="(408) 996–1010" />
      </div>
      <div className="form-control">
        <label className="label" htmlFor="emailAddress">Email Address</label>
        <input className="input input-bordered" type="email" id="emailAddress" placeholder="tcook@apple.com" />
      </div>

    </div>
  );
}

function Actions() {
  return (
    <div className="mt-5 py-5 px-8 border-t border-gray-200 dark:border-gray-700">
      <button className="btn btn-primary">Update</button>
    </div>
  );
}

const Content = () => {
  const tabs = ['Account Settings'];

  return (
    <div className="flex flex-col justify-between bg-transparent rounded-md border border-gray-200 dark:border-gray-700 px-5 py-6 shadow-lg">
      <div className="tabs">
        {tabs.map((tab, index) => (
          <a key={index} className="tab tab-bordered text-gray-600 dark:text-gray-400 font-semibold">{tab}</a>
        ))}
      </div>
      <div className="mt-5">
        <AccountSettings />
      </div>
      <Actions />
    </div>
  );
};

export default Content;
