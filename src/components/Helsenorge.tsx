import React from "react";
import { useAsync } from "react-async-hook";
import { fetchPages } from "../store";

type HelsenorgeProps = {
  conceptId: string;
};

const Helsenorge = ({ conceptId }: HelsenorgeProps) => {
  const request = useAsync(fetchPages, [conceptId]);
  const items = request.result || [];

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mt-3">helsenorge.no</h3>
      {items.map(({ title, description, link }) => (
        <div key={link}>
          <h4 key={link}>
            <a href={`http://localhost:51338${link}`}>{title}</a>
          </h4>
          <p>{description}</p>
        </div>
      ))}
    </div>
  );
};

export default Helsenorge;
