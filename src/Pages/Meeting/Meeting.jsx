import React from "react";
import {useForm} from 'react-hook-form'

const Meeting = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data)
  };

  return (
    <div className="px-4">
      <form className="w-32" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="border py-1">
          <legend className="px-2">Date</legend>
          <input
            {...register("date")}
            required
            className="outline-none"
            type="date"
            placeholder="Select your date"
          />
        </fieldset>
        <fieldset className="border py-1">
          <legend className="px-2">Time</legend>
          <input
            {...register("time")}
            required
            className="outline-none"
            type="time"
            placeholder="Select your time"
          />
        </fieldset>
        <fieldset className="border py-1">
          <legend className="px-2">Topic</legend>
          <input
            {...register("topic")}
            required
            className="outline-none"
            type="text"
            placeholder="Enter your topic"
          />
        </fieldset>
        <button className="bg-blue-400 mt-5">Submit</button>
      </form>
    </div>
  );
};

export default Meeting;
