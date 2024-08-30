import { f } from "@/styles";

const SVG = `
<svg width="82" height="30" viewBox="0 0 82 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 24C0 22.8954 0.895431 22 2 22H48C49.1046 22 50 22.8954 50 24C50 25.1046 49.1046 26 48 26H2C0.895432 26 0 25.1046 0 24Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 24C0 22.8954 0.895431 22 2 22H35V26H2C0.89543 26 0 25.1046 0 24Z" fill="#FFB938"/>
<path d="M41.0928 3.625V4.83594L36.6944 15H34.3194L38.7178 5.38281H33.0537V3.625H41.0928ZM49.73 8.3125V10.2812C49.73 11.1354 49.6389 11.8724 49.4566 12.4922C49.2743 13.1068 49.0112 13.612 48.6675 14.0078C48.329 14.3984 47.9253 14.6875 47.4566 14.875C46.9878 15.0625 46.467 15.1562 45.8941 15.1562C45.4357 15.1562 45.0086 15.099 44.6128 14.9844C44.217 14.8646 43.8602 14.6797 43.5425 14.4297C43.23 14.1797 42.9592 13.8646 42.73 13.4844C42.506 13.099 42.3342 12.6406 42.2144 12.1094C42.0946 11.5781 42.0347 10.9688 42.0347 10.2812V8.3125C42.0347 7.45833 42.1258 6.72656 42.3081 6.11719C42.4956 5.5026 42.7586 5 43.0972 4.60938C43.4409 4.21875 43.8472 3.93229 44.3159 3.75C44.7847 3.5625 45.3055 3.46875 45.8784 3.46875C46.3368 3.46875 46.7612 3.52865 47.1519 3.64844C47.5477 3.76302 47.9045 3.94271 48.2222 4.1875C48.5399 4.43229 48.8107 4.7474 49.0347 5.13281C49.2586 5.51302 49.4305 5.96875 49.5503 6.5C49.6701 7.02604 49.73 7.63021 49.73 8.3125ZM47.4722 10.5781V8.00781C47.4722 7.59635 47.4487 7.23698 47.4019 6.92969C47.3602 6.6224 47.2951 6.36198 47.2066 6.14844C47.118 5.92969 47.0086 5.7526 46.8784 5.61719C46.7482 5.48177 46.5998 5.38281 46.4331 5.32031C46.2665 5.25781 46.0816 5.22656 45.8784 5.22656C45.6232 5.22656 45.3967 5.27604 45.1987 5.375C45.006 5.47396 44.842 5.63281 44.7066 5.85156C44.5711 6.0651 44.467 6.35156 44.3941 6.71094C44.3264 7.0651 44.2925 7.4974 44.2925 8.00781V10.5781C44.2925 10.9896 44.3133 11.3516 44.355 11.6641C44.4019 11.9766 44.4696 12.2448 44.5581 12.4688C44.6519 12.6875 44.7612 12.8672 44.8862 13.0078C45.0165 13.1432 45.1649 13.2422 45.3316 13.3047C45.5034 13.3672 45.6909 13.3984 45.8941 13.3984C46.1441 13.3984 46.3654 13.349 46.5581 13.25C46.756 13.1458 46.9227 12.9844 47.0581 12.7656C47.1987 12.5417 47.3029 12.25 47.3706 11.8906C47.4383 11.5312 47.4722 11.0938 47.4722 10.5781Z" fill="#FFB938"/>
<path d="M70 30C76.6274 30 82 24.6274 82 18C82 11.3726 76.6274 6 70 6C63.3726 6 58 11.3726 58 18C58 24.6274 63.3726 30 70 30Z" fill="#FADD65"/>
<mask id="mask0_1_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="58" y="6" width="24" height="24">
<path d="M70 30C76.6274 30 82 24.6274 82 18C82 11.3726 76.6274 6 70 6C63.3726 6 58 11.3726 58 18C58 24.6274 63.3726 30 70 30Z" fill="#FAD84A"/>
</mask>
<g mask="url(#mask0_1_2)">
<path opacity="0.6" d="M62.35 24.6C64.7524 24.6 66.7 22.6525 66.7 20.25C66.7 17.8476 64.7524 15.9 62.35 15.9C59.9476 15.9 58 17.8476 58 20.25C58 22.6525 59.9476 24.6 62.35 24.6Z" fill="url(#paint0_radial_1_2)"/>
<path opacity="0.6" d="M77.6499 24.6C80.0524 24.6 81.9999 22.6525 81.9999 20.25C81.9999 17.8476 80.0524 15.9 77.6499 15.9C75.2475 15.9 73.2999 17.8476 73.2999 20.25C73.2999 22.6525 75.2475 24.6 77.6499 24.6Z" fill="url(#paint1_radial_1_2)"/>
</g>
<path fill-rule="evenodd" clip-rule="evenodd" d="M65.8 15.7125C65.2924 15.7125 64.7125 16.1248 64.7125 16.8C64.7125 17.1107 64.4607 17.3625 64.15 17.3625C63.8393 17.3625 63.5875 17.1107 63.5875 16.8C63.5875 15.3752 64.8076 14.5875 65.8 14.5875C66.7924 14.5875 68.0125 15.3752 68.0125 16.8C68.0125 17.1107 67.7607 17.3625 67.45 17.3625C67.1393 17.3625 66.8875 17.1107 66.8875 16.8C66.8875 16.1248 66.3076 15.7125 65.8 15.7125Z" fill="#895F00"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M74.35 15.7125C73.8425 15.7125 73.2625 16.1248 73.2625 16.8C73.2625 17.1107 73.0107 17.3625 72.7 17.3625C72.3894 17.3625 72.1375 17.1107 72.1375 16.8C72.1375 15.3752 73.3576 14.5875 74.35 14.5875C75.3425 14.5875 76.5625 15.3752 76.5625 16.8C76.5625 17.1107 76.3107 17.3625 76 17.3625C75.6894 17.3625 75.4375 17.1107 75.4375 16.8C75.4375 16.1248 74.8576 15.7125 74.35 15.7125Z" fill="#895F00"/>
<path d="M65.3499 19.5C64.77 19.5 64.2999 19.9701 64.2999 20.55C64.2999 20.8665 64.4164 21.2888 64.5793 21.6813C64.7585 22.113 65.0431 22.6292 65.4728 23.1286C66.3556 24.1545 67.8035 25.05 69.9999 25.05C72.1964 25.05 73.6443 24.1545 74.5271 23.1286C74.9568 22.6292 75.2414 22.113 75.4205 21.6813C75.5834 21.2888 75.6999 20.8665 75.6999 20.55C75.6999 19.9701 75.2298 19.5 74.6499 19.5H65.3499Z" fill="#895F00"/>
<path opacity="0.85" fill-rule="evenodd" clip-rule="evenodd" d="M63.8852 11.5681L63.8836 11.5713C63.8846 11.5694 63.8876 11.5642 63.8919 11.5571C63.9005 11.543 63.9154 11.5201 63.9369 11.4919C63.9805 11.4349 64.0484 11.3602 64.143 11.2927C64.3205 11.1659 64.6208 11.0417 65.1091 11.1638C65.31 11.214 65.5136 11.0919 65.5638 10.891C65.614 10.69 65.4919 10.4864 65.291 10.4362C64.5792 10.2583 64.0545 10.4341 63.707 10.6824C63.5391 10.8023 63.4195 10.9339 63.3412 11.0363C63.3018 11.0877 63.2722 11.1328 63.2515 11.1667L63.2146 11.2323C63.122 11.4175 63.1971 11.6428 63.3823 11.7354C63.5663 11.8274 63.7898 11.7539 63.8836 11.5713L63.8841 11.5702L63.8847 11.5691L63.8852 11.5681Z" fill="#D49D3A"/>
<path opacity="0.85" d="M76.4677 11.7354C76.2837 11.8274 76.0602 11.7539 75.9664 11.5714C75.9654 11.5694 75.9624 11.5642 75.9581 11.5571C75.9495 11.543 75.9346 11.5201 75.9131 11.4919C75.8695 11.4349 75.8016 11.3602 75.707 11.2927C75.5295 11.1659 75.2292 11.0417 74.7409 11.1638C74.54 11.214 74.3364 11.0919 74.2862 10.891C74.236 10.69 74.3581 10.4864 74.559 10.4362C75.2708 10.2583 75.7955 10.4341 76.143 10.6824C76.3109 10.8023 76.4305 10.9339 76.5088 11.0363C76.5482 11.0877 76.5778 11.1328 76.5985 11.1667C76.7177 11.3621 76.6913 11.6236 76.4677 11.7354Z" fill="#D49D3A"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M66.4001 20.7C66.3439 20.7 66.2924 20.7314 66.2667 20.7813C66.241 20.8313 66.2461 20.8925 66.2788 20.9382L66.2798 20.9396L66.2828 20.9436L66.2923 20.9558C66.3004 20.9658 66.3117 20.9793 66.3268 20.9959C66.357 21.0292 66.4019 21.0745 66.4642 21.1279C66.5888 21.2348 66.7825 21.3732 67.0661 21.5101C67.6335 21.784 68.5565 22.05 70.0001 22.05C71.4432 22.05 72.3306 21.7841 72.8629 21.5081C73.129 21.3702 73.3051 21.2302 73.4166 21.1214C73.4723 21.067 73.5116 21.0205 73.5378 20.9863C73.553 20.9664 73.5677 20.946 73.5803 20.9244C73.6068 20.878 73.6066 20.8209 73.5798 20.7747C73.553 20.7284 73.5035 20.7 73.4501 20.7H66.4001Z" fill="white"/>
<defs>
<radialGradient id="paint0_radial_1_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(62.3512 20.2017) scale(4.3512)">
<stop stop-color="#F15A24" stop-opacity="0.5"/>
<stop offset="0.0178806" stop-color="#F15E25" stop-opacity="0.5089"/>
<stop offset="0.2407" stop-color="#F6892B" stop-opacity="0.6203"/>
<stop offset="0.4561" stop-color="#FAAC30" stop-opacity="0.7281"/>
<stop offset="0.6595" stop-color="#FDC433" stop-opacity="0.8298"/>
<stop offset="0.8461" stop-color="#FED335" stop-opacity="0.923"/>
<stop offset="1" stop-color="#FFD836"/>
</radialGradient>
<radialGradient id="paint1_radial_1_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(77.5788 20.2017) scale(4.3512)">
<stop stop-color="#F15A24" stop-opacity="0.5"/>
<stop offset="0.0178806" stop-color="#F15E25" stop-opacity="0.5089"/>
<stop offset="0.2407" stop-color="#F6892B" stop-opacity="0.6203"/>
<stop offset="0.4561" stop-color="#FAAC30" stop-opacity="0.7281"/>
<stop offset="0.6595" stop-color="#FDC433" stop-opacity="0.8298"/>
<stop offset="0.8461" stop-color="#FED335" stop-opacity="0.923"/>
<stop offset="1" stop-color="#FFD836"/>
</radialGradient>
</defs>
</svg>
`;

const ImageProfileRating: React.FC = () => (
  <div className={f.flex} dangerouslySetInnerHTML={{ __html: SVG }} />
);

export default ImageProfileRating;
