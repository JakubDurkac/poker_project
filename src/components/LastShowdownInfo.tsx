import { Showdown } from "../types";
import { generateShowdownHtml } from "./Utils";

interface Props {
  showdownObjects: Showdown[];
}

const LastShowdownInfo = ({ showdownObjects }: Props) => {
  return (
    <div className="showdown-container">
      <div className="showdown-header showdown-line">
        <span>Name</span>
        <span>Last Showdown</span>
      </div>

      {showdownObjects.length > 0 ? (
        <>{generateShowdownHtml(showdownObjects)}</>
      ) : (
        <div className="showdown-message">Engage in a showdown to see.</div>
      )}
    </div>
  );
};

export default LastShowdownInfo;
