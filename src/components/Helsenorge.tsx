import React, { FunctionComponent } from "react";
import { useAsync } from "react-async-hook";
import { handleResponse, apiOptions } from "../api";

interface IHelsenorgeProps {
  id: string;
}

interface IHelsenorgePage {
  title: string;
  description: string;
  link: string;
}

const fetchPages = (conceptId: string) => {
  const url = new URL("http://localhost:51338/sokeside/snomed");
  url.searchParams.set("id", conceptId);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<IHelsenorgePage[]>(response),
  );
};

const Helsenorge: FunctionComponent<IHelsenorgeProps> = ({ id }) => {
  const request = useAsync(fetchPages, [id]);
  const items = request.result || [];

  if (items.length === 0) return null;

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
