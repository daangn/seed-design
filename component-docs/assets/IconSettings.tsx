import { f } from "@/styles";

const SVG = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.33321 3.86652C10.9725 3.86652 12.346 5.00428 12.7071 6.53318H21.3332C21.775 6.53318 22.1332 6.89136 22.1332 7.33318C22.1332 7.77501 21.775 8.13318 21.3332 8.13318H12.7071C12.346 9.66209 10.9725 10.7998 9.33321 10.7998C7.69397 10.7998 6.32046 9.66209 5.95931 8.13318H2.66655C2.22472 8.13318 1.86655 7.77501 1.86655 7.33318C1.86655 6.89136 2.22472 6.53318 2.66655 6.53318H5.95931C6.32046 5.00428 7.69397 3.86652 9.33321 3.86652ZM9.33321 5.46652C8.30228 5.46652 7.46655 6.30225 7.46655 7.33318C7.46655 8.36411 8.30228 9.19985 9.33321 9.19985C10.3641 9.19985 11.1999 8.36411 11.1999 7.33318C11.1999 6.30225 10.3641 5.46652 9.33321 5.46652Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.66655 17.4665H12.626C12.9871 18.9954 14.3606 20.1332 15.9999 20.1332C17.6391 20.1332 19.0126 18.9954 19.3738 17.4665H21.3332C21.775 17.4665 22.1332 17.1083 22.1332 16.6665C22.1332 16.2247 21.775 15.8665 21.3332 15.8665H19.3738C19.0126 14.3376 17.6391 13.1999 15.9999 13.1999C14.3606 13.1999 12.9871 14.3376 12.626 15.8665H2.66655C2.22472 15.8665 1.86655 16.2247 1.86655 16.6665C1.86655 17.1083 2.22472 17.4665 2.66655 17.4665ZM15.9999 14.7998C14.9689 14.7998 14.1332 15.6356 14.1332 16.6665C14.1332 17.6975 14.9689 18.5332 15.9999 18.5332C17.0308 18.5332 17.8665 17.6975 17.8665 16.6665C17.8665 15.6356 17.0308 14.7998 15.9999 14.7998Z" fill="currentColor"/>
</svg>
`;

const IconSettings: React.FC = () => (
  <div className={f.flex} dangerouslySetInnerHTML={{ __html: SVG }} />
);

export default IconSettings;
