import {BsBriefcaseFill} from 'react-icons/bs'
import {IoIosStar} from 'react-icons/io'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJobs = props => {
  const {jobItemDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobItemDetails

  return (
    <li className="similar-job-list-item">
      <div className="sj-job-item-view">
        <div className="company-logo">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="job-company-logo-img"
          />
          <div className="company-title">
            <h1 className="company-title-heading">{title}</h1>
            <div className="rating-section">
              <IoIosStar className="sj-gold" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <p className="sj-rating">Description</p>
        <p className="sj-company-description">{jobDescription}</p>
        <div className="company-details">
          <div className="sj-detail-section">
            <MdLocationOn className="sj-size" />
            <p className="sj-company-detail">{location}</p>
            <BsBriefcaseFill className="sj-size sj-spacing-left" />
            <p className="sj-company-detail">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
