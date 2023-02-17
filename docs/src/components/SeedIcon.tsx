import { type ForwardRefRenderFunction, forwardRef } from "react";

import spriteUrl from "../assets/sprite.svg";

export interface SeedIconProps {
  name: IconName;
  size?: number;
  className?: string;
}

const SeedIcon: ForwardRefRenderFunction<HTMLSpanElement, SeedIconProps> = (
  { name, className, size },
  ref,
) => {
  return (
    <span
      ref={ref}
      style={{ display: "inline-flex", width: size, height: size }}
      className={className}
      data-seed-icon={name}
      data-seed-icon-version="0.1.2"
    >
      <svg viewBox="0 0 24 24">
        <use href={`${spriteUrl}#${name}`} />
      </svg>
    </span>
  );
};

export default forwardRef(SeedIcon);

export const IconNames = [
  "icon_groupchat_king_thin",
  "icon_groupchat_king_regular",
  "icon_groupchat_king_fill",
  "icon_check_flower_thin",
  "icon_check_flower_regular",
  "icon_check_flower_fill",
  "icon_leaf_thin",
  "icon_leaf_regular",
  "icon_leaf_fill",
  "icon_location_thin",
  "icon_location_regular",
  "icon_location_fill",
  "icon_clock_thin",
  "icon_clock_regular",
  "icon_clock_fill",
  "icon_global_thin",
  "icon_global_regular",
  "icon_global_fill",
  "icon_restaurant_thin",
  "icon_restaurant_regular",
  "icon_restaurant_fill",
  "icon_contents_thin",
  "icon_contents_regular",
  "icon_contents_fill",
  "icon_copy_thin",
  "icon_copy_regular",
  "icon_copy_fill",
  "icon_near_me_thin",
  "icon_near_me_regular",
  "icon_near_me_fill",
  "icon_chart_thin",
  "icon_chart_regular",
  "icon_chart_fill",
  "icon_newtopic_thin",
  "icon_newtopic_regular",
  "icon_newtopic_fill",
  "icon_view_count_thin",
  "icon_view_count_regular",
  "icon_view_count_fill",
  "icon_user_group_thin",
  "icon_user_group_regular",
  "icon_user_group_fill",
  "icon_my_profile_thin",
  "icon_my_profile_regular",
  "icon_my_profile_fill",
  "icon_lock_thin",
  "icon_lock_regular",
  "icon_lock_fill",
  "icon_click_thin",
  "icon_click_regular",
  "icon_click_fill",
  "icon_emoticon_thin",
  "icon_emoticon_regular",
  "icon_emoticon_fill",
  "icon_chatting_send_thin",
  "icon_chatting_send_regular",
  "icon_chatting_send_fill",
  "icon_report_thin",
  "icon_report_regular",
  "icon_report_fill",
  "icon_scanner_thin",
  "icon_scanner_regular",
  "icon_scanner_fill",
  "icon_search_thin",
  "icon_search_regular",
  "icon_search_fill",
  "icon_keyboard_hiding_thin",
  "icon_keyboard_hiding_regular",
  "icon_keyboard_hiding_fill",
  "icon_file_thin",
  "icon_file_regular",
  "icon_file_fill",
  "icon_photo_edit_crop_thin",
  "icon_photo_edit_crop_regular",
  "icon_photo_edit_crop_fill",
  "icon_photo_edit_thin",
  "icon_photo_edit_regular",
  "icon_photo_edit_fill",
  "icon_ios_share_thin",
  "icon_ios_share_regular",
  "icon_ios_share_fill",
  "icon_write_story_thin",
  "icon_write_story_regular",
  "icon_write_story_fill",
  "icon_thumb_up_thin",
  "icon_thumb_up_regular",
  "icon_thumb_up_fill",
  "icon_thumb_down_thin",
  "icon_thumb_down_regular",
  "icon_thumb_down_fill",
  "icon_profile_thin",
  "icon_profile_regular",
  "icon_profile_fill",
  "icon_my_thin",
  "icon_my_regular",
  "icon_my_fill",
  "icon_photo_thin",
  "icon_photo_regular",
  "icon_photo_fill",
  "icon_coupon_thin",
  "icon_coupon_regular",
  "icon_coupon_fill",
  "icon_interest_thin",
  "icon_interest_regular",
  "icon_interest_fill",
  "icon_camera_thin",
  "icon_camera_regular",
  "icon_camera_fill",
  "icon_order_thin",
  "icon_order_regular",
  "icon_order_fill",
  "icon_housekeeping_book_thin",
  "icon_housekeeping_book_regular",
  "icon_housekeeping_book_fill",
  "icon_voucher_thin",
  "icon_voucher_regular",
  "icon_voucher_fill",
  "icon_trash_thin",
  "icon_trash_regular",
  "icon_trash_fill",
  "icon_photo_edit_draw_thin",
  "icon_photo_edit_draw_regular",
  "icon_photo_edit_draw_fill",
  "icon_coupon_used_thin",
  "icon_coupon_used_regular",
  "icon_coupon_used_fill",
  "icon_mission_thin",
  "icon_mission_regular",
  "icon_mission_fill",
  "icon_profile_badge_thin",
  "icon_profile_badge_regular",
  "icon_profile_badge_fill",
  "icon_keyword_thin",
  "icon_keyword_regular",
  "icon_keyword_fill",
  "icon_cart_thin",
  "icon_cart_regular",
  "icon_cart_fill",
  "icon_product_thin",
  "icon_product_regular",
  "icon_product_fill",
  "icon_delivery_thin",
  "icon_delivery_regular",
  "icon_delivery_fill",
  "icon_subtraction_thin",
  "icon_subtraction_regular",
  "icon_subtraction_fill",
  "icon_close_thin",
  "icon_close_regular",
  "icon_close_fill",
  "icon_price_won_thin",
  "icon_price_won_regular",
  "icon_price_won_fill",
  "icon_talkingup_thin",
  "icon_talkingup_regular",
  "icon_talkingup_fill",
  "icon_talkingdown_thin",
  "icon_talkingdown_regular",
  "icon_talkingdown_fill",
  "icon_chevron_right_thin",
  "icon_chevron_right_regular",
  "icon_chevron_right_fill",
  "icon_chevron_left_thin",
  "icon_chevron_left_regular",
  "icon_chevron_left_fill",
  "icon_expand_less_thin",
  "icon_expand_less_regular",
  "icon_expand_less_fill",
  "icon_expand_more_thin",
  "icon_expand_more_regular",
  "icon_expand_more_fill",
  "icon_percent_thin",
  "icon_percent_regular",
  "icon_percent_fill",
  "icon_add_thin",
  "icon_add_regular",
  "icon_add_fill",
  "icon_check_thin",
  "icon_check_regular",
  "icon_check_fill",
  "icon_reservation_thin",
  "icon_reservation_regular",
  "icon_reservation_fill",
  "icon_calendar_thin",
  "icon_calendar_regular",
  "icon_calendar_fill",
  "icon_question_check_thin",
  "icon_question_check_regular",
  "icon_question_check_fill",
  "icon_coupon_download_done_thin",
  "icon_coupon_download_done_regular",
  "icon_coupon_download_done_fill",
  "icon_volume_on_thin",
  "icon_volume_on_regular",
  "icon_volume_on_fill",
  "icon_volume_off_thin",
  "icon_volume_off_regular",
  "icon_volume_off_fill",
  "icon_notification_thin",
  "icon_notification_regular",
  "icon_notification_fill",
  "icon_loudspeaker_thin",
  "icon_loudspeaker_regular",
  "icon_loudspeaker_fill",
  "icon_notification_off_thin",
  "icon_notification_off_regular",
  "icon_notification_off_fill",
  "icon_helpcenter_thin",
  "icon_helpcenter_regular",
  "icon_helpcenter_fill",
  "icon_helper_thin",
  "icon_helper_regular",
  "icon_helper_fill",
  "icon_mic_off_thin",
  "icon_mic_off_regular",
  "icon_mic_off_fill",
  "icon_mic_thin",
  "icon_mic_regular",
  "icon_mic_fill",
  "icon_call_declined_thin",
  "icon_call_declined_regular",
  "icon_call_declined_fill",
  "icon_headphone_thin",
  "icon_headphone_regular",
  "icon_headphone_fill",
  "icon_edit_thin",
  "icon_edit_regular",
  "icon_edit_fill",
  "icon_write_thin",
  "icon_write_regular",
  "icon_write_fill",
  "icon_write_frequent_use_thin",
  "icon_write_frequent_use_regular",
  "icon_write_frequent_use_fill",
  "icon_story_article_thin",
  "icon_story_article_regular",
  "icon_story_article_fill",
  "icon_import_thin",
  "icon_import_regular",
  "icon_import_fill",
  "icon_article_thin",
  "icon_article_regular",
  "icon_article_fill",
  "icon_community_thin",
  "icon_community_regular",
  "icon_community_fill",
  "icon_bill_thin",
  "icon_bill_regular",
  "icon_bill_fill",
  "icon_serach_doc_thin",
  "icon_serach_doc_regular",
  "icon_serach_doc_fill",
  "icon_menu_thin",
  "icon_menu_regular",
  "icon_menu_fill",
  "icon_android_share_thin",
  "icon_android_share_regular",
  "icon_android_share_fill",
  "icon_photo_edit_rotate_thin",
  "icon_photo_edit_rotate_regular",
  "icon_photo_edit_rotate_fill",
  "icon_list_select_thin",
  "icon_list_select_regular",
  "icon_list_select_fill",
  "icon_filter02_thin",
  "icon_filter02_regular",
  "icon_filter02_fill",
  "icon_retry_thin",
  "icon_retry_regular",
  "icon_retry_fill",
  "icon_reply_re_thin",
  "icon_reply_re_regular",
  "icon_reply_re_fill",
  "icon_heart_thin",
  "icon_heart_regular",
  "icon_heart_fill",
  "icon_interest_list_thin",
  "icon_interest_list_regular",
  "icon_interest_list_fill",
  "icon_bookmark_thin",
  "icon_bookmark_regular",
  "icon_bookmark_fill",
  "icon_certification_thin",
  "icon_certification_regular",
  "icon_certification_fill",
  "icon_gps_enable_thin",
  "icon_gps_enable_regular",
  "icon_gps_enable_fill",
  "icon_gps_thin",
  "icon_gps_regular",
  "icon_gps_fill",
  "icon_gps_enable2_thin",
  "icon_gps_enable2_regular",
  "icon_gps_enable2_fill",
  "icon_market_thin",
  "icon_market_regular",
  "icon_market_fill",
  "icon_home_thin",
  "icon_home_regular",
  "icon_home_fill",
  "icon_reply_thin",
  "icon_reply_regular",
  "icon_reply_fill",
  "icon_reply_mission_thin",
  "icon_reply_mission_regular",
  "icon_reply_mission_fill",
  "icon_money_won_thin",
  "icon_money_won_regular",
  "icon_money_won_fill",
  "icon_arrow_drop_down_thin",
  "icon_arrow_drop_down_regular",
  "icon_arrow_drop_down_fill",
  "icon_arrow_drop_up_thin",
  "icon_arrow_drop_up_regular",
  "icon_arrow_drop_up_fill",
  "icon_moon_thin",
  "icon_moon_regular",
  "icon_moon_fill",
  "icon_pushpin_thin",
  "icon_pushpin_regular",
  "icon_pushpin_fill",
  "icon_more_vert_thin",
  "icon_more_vert_regular",
  "icon_more_vert_fill",
  "icon_more_horiz_thin",
  "icon_more_horiz_regular",
  "icon_more_horiz_fill",
  "icon_chat_bubble_check_thin",
  "icon_chat_bubble_check_regular",
  "icon_chat_bubble_check_fill",
  "icon_market_check_thin",
  "icon_market_check_regular",
  "icon_market_check_fill",
  "icon_bookmark_list_thin",
  "icon_bookmark_list_regular",
  "icon_bookmark_list_fill",
  "icon_call_thin",
  "icon_call_regular",
  "icon_call_fill",
  "icon_refund_thin",
  "icon_refund_regular",
  "icon_refund_fill",
  "icon_payment_thin",
  "icon_payment_regular",
  "icon_payment_fill",
  "icon_undo_thin",
  "icon_undo_regular",
  "icon_undo_fill",
  "icon_redo_thin",
  "icon_redo_regular",
  "icon_redo_fill",
  "icon_suggest_thin",
  "icon_suggest_regular",
  "icon_suggest_fill",
  "icon_invite_thin",
  "icon_invite_regular",
  "icon_invite_fill",
  "icon_setting_thin",
  "icon_setting_regular",
  "icon_setting_fill",
  "icon_warning_thin",
  "icon_warning_regular",
  "icon_warning_fill",
  "icon_help_thin",
  "icon_help_regular",
  "icon_help_fill",
  "icon_info_thin",
  "icon_info_regular",
  "icon_info_fill",
  "icon_remove_circle_thin",
  "icon_remove_circle_regular",
  "icon_remove_circle_fill",
  "icon_add_circle_thin",
  "icon_add_circle_regular",
  "icon_add_circle_fill",
  "icon_subtract_circle_thin",
  "icon_subtract_circle_regular",
  "icon_subtract_circle_fill",
  "icon_sell_thin",
  "icon_sell_regular",
  "icon_sell_fill",
  "icon_prohibition_thin",
  "icon_prohibition_regular",
  "icon_prohibition_fill",
  "icon_backward_thin",
  "icon_backward_regular",
  "icon_backward_fill",
  "icon_forward_thin",
  "icon_forward_regular",
  "icon_forward_fill",
  "icon_arrow_upward_thin",
  "icon_arrow_upward_regular",
  "icon_arrow_upward_fill",
  "icon_arrow_downward_thin",
  "icon_arrow_downward_regular",
  "icon_arrow_downward_fill",
  "icon_notification_fall_thin",
  "icon_notification_fall_regular",
  "icon_notification_fall_fill",
  "icon_download_thin",
  "icon_download_regular",
  "icon_download_fill",
  "icon_arrow_thin",
  "icon_arrow_regular",
  "icon_arrow_fill",
  "icon_convert_thin",
  "icon_convert_regular",
  "icon_convert_fill",
  "icon_translate_thin",
  "icon_translate_regular",
  "icon_translate_fill",
  "icon_delete_keyboard_thin",
  "icon_delete_keyboard_regular",
  "icon_delete_keyboard_fill",
  "icon_chatting_thin",
  "icon_chatting_regular",
  "icon_chatting_fill",
  "icon_confirmation_thin",
  "icon_confirmation_regular",
  "icon_confirmation_fill",
  "icon_note_thin",
  "icon_note_regular",
  "icon_note_fill",
  "icon_list_thin",
  "icon_list_regular",
  "icon_list_fill",
  "icon_photo_several_thin",
  "icon_photo_several_regular",
  "icon_photo_several_fill",
  "icon_mention_thin",
  "icon_mention_regular",
  "icon_mention_fill",
  "icon_challenge_thin",
  "icon_challenge_regular",
  "icon_challenge_fill",
  "icon_hashtag_thin",
  "icon_hashtag_regular",
  "icon_hashtag_fill",
  "icon_vote_thin",
  "icon_vote_regular",
  "icon_vote_fill",
  "icon_car_around_view_thin",
  "icon_car_around_view_regular",
  "icon_car_around_view_fill",
  "icon_car_cruise_control_thin",
  "icon_car_cruise_control_regular",
  "icon_car_cruise_control_fill",
  "icon_aeb_thin",
  "icon_aeb_regular",
  "icon_aeb_fill",
  "icon_car_ldws_thin",
  "icon_car_ldws_regular",
  "icon_car_ldws_fill",
  "icon_car_blind_spot_thin",
  "icon_car_blind_spot_regular",
  "icon_car_blind_spot_fill",
  "icon_car_epb_thin",
  "icon_car_epb_regular",
  "icon_car_epb_fill",
  "icon_car_ventilation_seat_thin",
  "icon_car_ventilation_seat_regular",
  "icon_car_ventilation_seat_fill",
  "icon_car_power_trunk_thin",
  "icon_car_power_trunk_regular",
  "icon_car_power_trunk_fill",
  "icon_sun_thin",
  "icon_sun_regular",
  "icon_sun_fill",
  "icon_car_smart_key_thin",
  "icon_car_smart_key_regular",
  "icon_car_smart_key_fill",
  "icon_car_heated_steering_wheel_thin",
  "icon_car_heated_steering_wheel_regular",
  "icon_car_heated_steering_wheel_fill",
  "icon_car_rear_camera_thin",
  "icon_car_rear_camera_regular",
  "icon_car_rear_camera_fill",
  "icon_car_navigation_thin",
  "icon_car_navigation_regular",
  "icon_car_navigation_fill",
  "icon_car_rear_sensor_thin",
  "icon_car_rear_sensor_regular",
  "icon_car_rear_sensor_fill",
  "icon_car_leather_seat_thin",
  "icon_car_leather_seat_regular",
  "icon_car_leather_seat_fill",
  "icon_car_heated_seat_thin",
  "icon_car_heated_seat_regular",
  "icon_car_heated_seat_fill",
  "icon_text_thin",
  "icon_text_regular",
  "icon_text_fill",
  "icon_bold_thin",
  "icon_bold_regular",
  "icon_bold_fill",
  "icon_list_thumbnail_thin",
  "icon_list_thumbnail_regular",
  "icon_list_thumbnail_fill",
  "icon_list_card_thin",
  "icon_list_card_regular",
  "icon_list_card_fill",
  "icon_condo_thin",
  "icon_condo_regular",
  "icon_condo_fill",
  "icon_cobuying_thin",
  "icon_cobuying_regular",
  "icon_cobuying_fill",
  "icon_gender_thin",
  "icon_gender_regular",
  "icon_gender_fill",
  "icon_expand_thin",
  "icon_expand_regular",
  "icon_expand_fill",
  "icon_video_thin",
  "icon_video_regular",
  "icon_video_fill",
  "icon_walk_thin",
  "icon_walk_regular",
  "icon_walk_fill",
  "icon_map_thin",
  "icon_map_regular",
  "icon_map_fill",
  "icon_handle_thin",
  "icon_handle_regular",
  "icon_handle_fill",
  "icon_signout_thin",
  "icon_signout_regular",
  "icon_signout_fill",
  "icon_poll_thin",
  "icon_poll_regular",
  "icon_poll_fill",
  "icon_list_check_thin",
  "icon_list_check_regular",
  "icon_list_check_fill",
  "icon_money_send_thin",
  "icon_money_send_regular",
  "icon_money_send_fill",
  "icon_view_count_off_thin",
  "icon_view_count_off_regular",
  "icon_view_count_off_fill",
] as IconName[];

type IconName =
  | "icon_groupchat_king_thin"
  | "icon_groupchat_king_regular"
  | "icon_groupchat_king_fill"
  | "icon_check_flower_thin"
  | "icon_check_flower_regular"
  | "icon_check_flower_fill"
  | "icon_leaf_thin"
  | "icon_leaf_regular"
  | "icon_leaf_fill"
  | "icon_location_thin"
  | "icon_location_regular"
  | "icon_location_fill"
  | "icon_clock_thin"
  | "icon_clock_regular"
  | "icon_clock_fill"
  | "icon_global_thin"
  | "icon_global_regular"
  | "icon_global_fill"
  | "icon_restaurant_thin"
  | "icon_restaurant_regular"
  | "icon_restaurant_fill"
  | "icon_contents_thin"
  | "icon_contents_regular"
  | "icon_contents_fill"
  | "icon_copy_thin"
  | "icon_copy_regular"
  | "icon_copy_fill"
  | "icon_near_me_thin"
  | "icon_near_me_regular"
  | "icon_near_me_fill"
  | "icon_chart_thin"
  | "icon_chart_regular"
  | "icon_chart_fill"
  | "icon_newtopic_thin"
  | "icon_newtopic_regular"
  | "icon_newtopic_fill"
  | "icon_view_count_thin"
  | "icon_view_count_regular"
  | "icon_view_count_fill"
  | "icon_user_group_thin"
  | "icon_user_group_regular"
  | "icon_user_group_fill"
  | "icon_my_profile_thin"
  | "icon_my_profile_regular"
  | "icon_my_profile_fill"
  | "icon_lock_thin"
  | "icon_lock_regular"
  | "icon_lock_fill"
  | "icon_click_thin"
  | "icon_click_regular"
  | "icon_click_fill"
  | "icon_emoticon_thin"
  | "icon_emoticon_regular"
  | "icon_emoticon_fill"
  | "icon_chatting_send_thin"
  | "icon_chatting_send_regular"
  | "icon_chatting_send_fill"
  | "icon_report_thin"
  | "icon_report_regular"
  | "icon_report_fill"
  | "icon_scanner_thin"
  | "icon_scanner_regular"
  | "icon_scanner_fill"
  | "icon_search_thin"
  | "icon_search_regular"
  | "icon_search_fill"
  | "icon_keyboard_hiding_thin"
  | "icon_keyboard_hiding_regular"
  | "icon_keyboard_hiding_fill"
  | "icon_file_thin"
  | "icon_file_regular"
  | "icon_file_fill"
  | "icon_photo_edit_crop_thin"
  | "icon_photo_edit_crop_regular"
  | "icon_photo_edit_crop_fill"
  | "icon_photo_edit_thin"
  | "icon_photo_edit_regular"
  | "icon_photo_edit_fill"
  | "icon_ios_share_thin"
  | "icon_ios_share_regular"
  | "icon_ios_share_fill"
  | "icon_write_story_thin"
  | "icon_write_story_regular"
  | "icon_write_story_fill"
  | "icon_thumb_up_thin"
  | "icon_thumb_up_regular"
  | "icon_thumb_up_fill"
  | "icon_thumb_down_thin"
  | "icon_thumb_down_regular"
  | "icon_thumb_down_fill"
  | "icon_profile_thin"
  | "icon_profile_regular"
  | "icon_profile_fill"
  | "icon_my_thin"
  | "icon_my_regular"
  | "icon_my_fill"
  | "icon_photo_thin"
  | "icon_photo_regular"
  | "icon_photo_fill"
  | "icon_coupon_thin"
  | "icon_coupon_regular"
  | "icon_coupon_fill"
  | "icon_interest_thin"
  | "icon_interest_regular"
  | "icon_interest_fill"
  | "icon_camera_thin"
  | "icon_camera_regular"
  | "icon_camera_fill"
  | "icon_order_thin"
  | "icon_order_regular"
  | "icon_order_fill"
  | "icon_housekeeping_book_thin"
  | "icon_housekeeping_book_regular"
  | "icon_housekeeping_book_fill"
  | "icon_voucher_thin"
  | "icon_voucher_regular"
  | "icon_voucher_fill"
  | "icon_trash_thin"
  | "icon_trash_regular"
  | "icon_trash_fill"
  | "icon_photo_edit_draw_thin"
  | "icon_photo_edit_draw_regular"
  | "icon_photo_edit_draw_fill"
  | "icon_coupon_used_thin"
  | "icon_coupon_used_regular"
  | "icon_coupon_used_fill"
  | "icon_mission_thin"
  | "icon_mission_regular"
  | "icon_mission_fill"
  | "icon_profile_badge_thin"
  | "icon_profile_badge_regular"
  | "icon_profile_badge_fill"
  | "icon_keyword_thin"
  | "icon_keyword_regular"
  | "icon_keyword_fill"
  | "icon_cart_thin"
  | "icon_cart_regular"
  | "icon_cart_fill"
  | "icon_product_thin"
  | "icon_product_regular"
  | "icon_product_fill"
  | "icon_delivery_thin"
  | "icon_delivery_regular"
  | "icon_delivery_fill"
  | "icon_subtraction_thin"
  | "icon_subtraction_regular"
  | "icon_subtraction_fill"
  | "icon_close_thin"
  | "icon_close_regular"
  | "icon_close_fill"
  | "icon_price_won_thin"
  | "icon_price_won_regular"
  | "icon_price_won_fill"
  | "icon_talkingup_thin"
  | "icon_talkingup_regular"
  | "icon_talkingup_fill"
  | "icon_talkingdown_thin"
  | "icon_talkingdown_regular"
  | "icon_talkingdown_fill"
  | "icon_chevron_right_thin"
  | "icon_chevron_right_regular"
  | "icon_chevron_right_fill"
  | "icon_chevron_left_thin"
  | "icon_chevron_left_regular"
  | "icon_chevron_left_fill"
  | "icon_expand_less_thin"
  | "icon_expand_less_regular"
  | "icon_expand_less_fill"
  | "icon_expand_more_thin"
  | "icon_expand_more_regular"
  | "icon_expand_more_fill"
  | "icon_percent_thin"
  | "icon_percent_regular"
  | "icon_percent_fill"
  | "icon_add_thin"
  | "icon_add_regular"
  | "icon_add_fill"
  | "icon_check_thin"
  | "icon_check_regular"
  | "icon_check_fill"
  | "icon_reservation_thin"
  | "icon_reservation_regular"
  | "icon_reservation_fill"
  | "icon_calendar_thin"
  | "icon_calendar_regular"
  | "icon_calendar_fill"
  | "icon_question_check_thin"
  | "icon_question_check_regular"
  | "icon_question_check_fill"
  | "icon_coupon_download_done_thin"
  | "icon_coupon_download_done_regular"
  | "icon_coupon_download_done_fill"
  | "icon_volume_on_thin"
  | "icon_volume_on_regular"
  | "icon_volume_on_fill"
  | "icon_volume_off_thin"
  | "icon_volume_off_regular"
  | "icon_volume_off_fill"
  | "icon_notification_thin"
  | "icon_notification_regular"
  | "icon_notification_fill"
  | "icon_loudspeaker_thin"
  | "icon_loudspeaker_regular"
  | "icon_loudspeaker_fill"
  | "icon_notification_off_thin"
  | "icon_notification_off_regular"
  | "icon_notification_off_fill"
  | "icon_helpcenter_thin"
  | "icon_helpcenter_regular"
  | "icon_helpcenter_fill"
  | "icon_helper_thin"
  | "icon_helper_regular"
  | "icon_helper_fill"
  | "icon_mic_off_thin"
  | "icon_mic_off_regular"
  | "icon_mic_off_fill"
  | "icon_mic_thin"
  | "icon_mic_regular"
  | "icon_mic_fill"
  | "icon_call_declined_thin"
  | "icon_call_declined_regular"
  | "icon_call_declined_fill"
  | "icon_headphone_thin"
  | "icon_headphone_regular"
  | "icon_headphone_fill"
  | "icon_edit_thin"
  | "icon_edit_regular"
  | "icon_edit_fill"
  | "icon_write_thin"
  | "icon_write_regular"
  | "icon_write_fill"
  | "icon_write_frequent_use_thin"
  | "icon_write_frequent_use_regular"
  | "icon_write_frequent_use_fill"
  | "icon_story_article_thin"
  | "icon_story_article_regular"
  | "icon_story_article_fill"
  | "icon_import_thin"
  | "icon_import_regular"
  | "icon_import_fill"
  | "icon_article_thin"
  | "icon_article_regular"
  | "icon_article_fill"
  | "icon_community_thin"
  | "icon_community_regular"
  | "icon_community_fill"
  | "icon_bill_thin"
  | "icon_bill_regular"
  | "icon_bill_fill"
  | "icon_serach_doc_thin"
  | "icon_serach_doc_regular"
  | "icon_serach_doc_fill"
  | "icon_menu_thin"
  | "icon_menu_regular"
  | "icon_menu_fill"
  | "icon_android_share_thin"
  | "icon_android_share_regular"
  | "icon_android_share_fill"
  | "icon_photo_edit_rotate_thin"
  | "icon_photo_edit_rotate_regular"
  | "icon_photo_edit_rotate_fill"
  | "icon_list_select_thin"
  | "icon_list_select_regular"
  | "icon_list_select_fill"
  | "icon_filter02_thin"
  | "icon_filter02_regular"
  | "icon_filter02_fill"
  | "icon_retry_thin"
  | "icon_retry_regular"
  | "icon_retry_fill"
  | "icon_reply_re_thin"
  | "icon_reply_re_regular"
  | "icon_reply_re_fill"
  | "icon_heart_thin"
  | "icon_heart_regular"
  | "icon_heart_fill"
  | "icon_interest_list_thin"
  | "icon_interest_list_regular"
  | "icon_interest_list_fill"
  | "icon_bookmark_thin"
  | "icon_bookmark_regular"
  | "icon_bookmark_fill"
  | "icon_certification_thin"
  | "icon_certification_regular"
  | "icon_certification_fill"
  | "icon_gps_enable_thin"
  | "icon_gps_enable_regular"
  | "icon_gps_enable_fill"
  | "icon_gps_thin"
  | "icon_gps_regular"
  | "icon_gps_fill"
  | "icon_gps_enable2_thin"
  | "icon_gps_enable2_regular"
  | "icon_gps_enable2_fill"
  | "icon_market_thin"
  | "icon_market_regular"
  | "icon_market_fill"
  | "icon_home_thin"
  | "icon_home_regular"
  | "icon_home_fill"
  | "icon_reply_thin"
  | "icon_reply_regular"
  | "icon_reply_fill"
  | "icon_reply_mission_thin"
  | "icon_reply_mission_regular"
  | "icon_reply_mission_fill"
  | "icon_money_won_thin"
  | "icon_money_won_regular"
  | "icon_money_won_fill"
  | "icon_arrow_drop_down_thin"
  | "icon_arrow_drop_down_regular"
  | "icon_arrow_drop_down_fill"
  | "icon_arrow_drop_up_thin"
  | "icon_arrow_drop_up_regular"
  | "icon_arrow_drop_up_fill"
  | "icon_moon_thin"
  | "icon_moon_regular"
  | "icon_moon_fill"
  | "icon_pushpin_thin"
  | "icon_pushpin_regular"
  | "icon_pushpin_fill"
  | "icon_more_vert_thin"
  | "icon_more_vert_regular"
  | "icon_more_vert_fill"
  | "icon_more_horiz_thin"
  | "icon_more_horiz_regular"
  | "icon_more_horiz_fill"
  | "icon_chat_bubble_check_thin"
  | "icon_chat_bubble_check_regular"
  | "icon_chat_bubble_check_fill"
  | "icon_market_check_thin"
  | "icon_market_check_regular"
  | "icon_market_check_fill"
  | "icon_bookmark_list_thin"
  | "icon_bookmark_list_regular"
  | "icon_bookmark_list_fill"
  | "icon_call_thin"
  | "icon_call_regular"
  | "icon_call_fill"
  | "icon_refund_thin"
  | "icon_refund_regular"
  | "icon_refund_fill"
  | "icon_payment_thin"
  | "icon_payment_regular"
  | "icon_payment_fill"
  | "icon_undo_thin"
  | "icon_undo_regular"
  | "icon_undo_fill"
  | "icon_redo_thin"
  | "icon_redo_regular"
  | "icon_redo_fill"
  | "icon_suggest_thin"
  | "icon_suggest_regular"
  | "icon_suggest_fill"
  | "icon_invite_thin"
  | "icon_invite_regular"
  | "icon_invite_fill"
  | "icon_setting_thin"
  | "icon_setting_regular"
  | "icon_setting_fill"
  | "icon_warning_thin"
  | "icon_warning_regular"
  | "icon_warning_fill"
  | "icon_help_thin"
  | "icon_help_regular"
  | "icon_help_fill"
  | "icon_info_thin"
  | "icon_info_regular"
  | "icon_info_fill"
  | "icon_remove_circle_thin"
  | "icon_remove_circle_regular"
  | "icon_remove_circle_fill"
  | "icon_add_circle_thin"
  | "icon_add_circle_regular"
  | "icon_add_circle_fill"
  | "icon_subtract_circle_thin"
  | "icon_subtract_circle_regular"
  | "icon_subtract_circle_fill"
  | "icon_sell_thin"
  | "icon_sell_regular"
  | "icon_sell_fill"
  | "icon_prohibition_thin"
  | "icon_prohibition_regular"
  | "icon_prohibition_fill"
  | "icon_backward_thin"
  | "icon_backward_regular"
  | "icon_backward_fill"
  | "icon_forward_thin"
  | "icon_forward_regular"
  | "icon_forward_fill"
  | "icon_arrow_upward_thin"
  | "icon_arrow_upward_regular"
  | "icon_arrow_upward_fill"
  | "icon_arrow_downward_thin"
  | "icon_arrow_downward_regular"
  | "icon_arrow_downward_fill"
  | "icon_notification_fall_thin"
  | "icon_notification_fall_regular"
  | "icon_notification_fall_fill"
  | "icon_download_thin"
  | "icon_download_regular"
  | "icon_download_fill"
  | "icon_arrow_thin"
  | "icon_arrow_regular"
  | "icon_arrow_fill"
  | "icon_convert_thin"
  | "icon_convert_regular"
  | "icon_convert_fill"
  | "icon_translate_thin"
  | "icon_translate_regular"
  | "icon_translate_fill"
  | "icon_delete_keyboard_thin"
  | "icon_delete_keyboard_regular"
  | "icon_delete_keyboard_fill"
  | "icon_chatting_thin"
  | "icon_chatting_regular"
  | "icon_chatting_fill"
  | "icon_confirmation_thin"
  | "icon_confirmation_regular"
  | "icon_confirmation_fill"
  | "icon_note_thin"
  | "icon_note_regular"
  | "icon_note_fill"
  | "icon_list_thin"
  | "icon_list_regular"
  | "icon_list_fill"
  | "icon_photo_several_thin"
  | "icon_photo_several_regular"
  | "icon_photo_several_fill"
  | "icon_mention_thin"
  | "icon_mention_regular"
  | "icon_mention_fill"
  | "icon_challenge_thin"
  | "icon_challenge_regular"
  | "icon_challenge_fill"
  | "icon_hashtag_thin"
  | "icon_hashtag_regular"
  | "icon_hashtag_fill"
  | "icon_vote_thin"
  | "icon_vote_regular"
  | "icon_vote_fill"
  | "icon_car_around_view_thin"
  | "icon_car_around_view_regular"
  | "icon_car_around_view_fill"
  | "icon_car_cruise_control_thin"
  | "icon_car_cruise_control_regular"
  | "icon_car_cruise_control_fill"
  | "icon_aeb_thin"
  | "icon_aeb_regular"
  | "icon_aeb_fill"
  | "icon_car_ldws_thin"
  | "icon_car_ldws_regular"
  | "icon_car_ldws_fill"
  | "icon_car_blind_spot_thin"
  | "icon_car_blind_spot_regular"
  | "icon_car_blind_spot_fill"
  | "icon_car_epb_thin"
  | "icon_car_epb_regular"
  | "icon_car_epb_fill"
  | "icon_car_ventilation_seat_thin"
  | "icon_car_ventilation_seat_regular"
  | "icon_car_ventilation_seat_fill"
  | "icon_car_power_trunk_thin"
  | "icon_car_power_trunk_regular"
  | "icon_car_power_trunk_fill"
  | "icon_sun_thin"
  | "icon_sun_regular"
  | "icon_sun_fill"
  | "icon_car_smart_key_thin"
  | "icon_car_smart_key_regular"
  | "icon_car_smart_key_fill"
  | "icon_car_heated_steering_wheel_thin"
  | "icon_car_heated_steering_wheel_regular"
  | "icon_car_heated_steering_wheel_fill"
  | "icon_car_rear_camera_thin"
  | "icon_car_rear_camera_regular"
  | "icon_car_rear_camera_fill"
  | "icon_car_navigation_thin"
  | "icon_car_navigation_regular"
  | "icon_car_navigation_fill"
  | "icon_car_rear_sensor_thin"
  | "icon_car_rear_sensor_regular"
  | "icon_car_rear_sensor_fill"
  | "icon_car_leather_seat_thin"
  | "icon_car_leather_seat_regular"
  | "icon_car_leather_seat_fill"
  | "icon_car_heated_seat_thin"
  | "icon_car_heated_seat_regular"
  | "icon_car_heated_seat_fill"
  | "icon_text_thin"
  | "icon_text_regular"
  | "icon_text_fill"
  | "icon_bold_thin"
  | "icon_bold_regular"
  | "icon_bold_fill"
  | "icon_list_thumbnail_thin"
  | "icon_list_thumbnail_regular"
  | "icon_list_thumbnail_fill"
  | "icon_list_card_thin"
  | "icon_list_card_regular"
  | "icon_list_card_fill"
  | "icon_condo_thin"
  | "icon_condo_regular"
  | "icon_condo_fill"
  | "icon_cobuying_thin"
  | "icon_cobuying_regular"
  | "icon_cobuying_fill"
  | "icon_gender_thin"
  | "icon_gender_regular"
  | "icon_gender_fill"
  | "icon_expand_thin"
  | "icon_expand_regular"
  | "icon_expand_fill"
  | "icon_video_thin"
  | "icon_video_regular"
  | "icon_video_fill"
  | "icon_walk_thin"
  | "icon_walk_regular"
  | "icon_walk_fill"
  | "icon_map_thin"
  | "icon_map_regular"
  | "icon_map_fill"
  | "icon_handle_thin"
  | "icon_handle_regular"
  | "icon_handle_fill"
  | "icon_signout_thin"
  | "icon_signout_regular"
  | "icon_signout_fill"
  | "icon_poll_thin"
  | "icon_poll_regular"
  | "icon_poll_fill"
  | "icon_list_check_thin"
  | "icon_list_check_regular"
  | "icon_list_check_fill"
  | "icon_money_send_thin"
  | "icon_money_send_regular"
  | "icon_money_send_fill"
  | "icon_view_count_off_thin"
  | "icon_view_count_off_regular"
  | "icon_view_count_off_fill";
