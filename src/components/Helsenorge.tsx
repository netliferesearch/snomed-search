import React, { FunctionComponent } from "react";
import { useAsync } from "react-async-hook";
import { apiOptions, handleResponse } from "../api";

interface IHelsenorgeProps {
  readonly conceptId: string;
}

interface IHelsenorgePage {
  readonly title: string;
  readonly description: string;
  readonly link: string;
}

const fetchPages = (conceptId: string) => {
  const url = new URL("http://localhost:51338/sokeside/snomed");
  url.searchParams.set("id", conceptId);
  return fetch(url.toString(), apiOptions).then((response) =>
    handleResponse<IHelsenorgePage[]>(response),
  );
};

const Helsenorge: FunctionComponent<IHelsenorgeProps> = ({ conceptId }) => {
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
