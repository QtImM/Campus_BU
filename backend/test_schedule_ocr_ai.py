import unittest

from schedule_ocr_ai import _extract_json_payload, _normalize_ai_items


class ScheduleOcrAiTests(unittest.TestCase):
    def test_extract_json_payload_from_fenced_response(self):
        payload = _extract_json_payload(
            """```json
            {"items":[{"course_code":"COMP1010","day_of_week":1,"start_time":"09:30","end_time":"12:30"}]}
            ```"""
        )

        self.assertEqual(payload["items"][0]["course_code"], "COMP1010")

    def test_normalize_ai_items_accepts_mixed_field_names(self):
        items = _normalize_ai_items(
            [
                {
                    "courseName": "Distributed Systems",
                    "courseCode": "COMP7650",
                    "room": "WLB103",
                    "day": "Friday",
                    "startTime": "15.30",
                    "endTime": "18:30",
                    "sourceBlock": "COMP7650 Friday 15:30-18:30 WLB103",
                    "confidence": 0.93,
                }
            ]
        )

        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["course_name"], "Distributed Systems")
        self.assertEqual(items[0]["course_code"], "COMP7650")
        self.assertEqual(items[0]["day_of_week"], 5)
        self.assertEqual(items[0]["start_time"], "15:30")
        self.assertEqual(items[0]["end_time"], "18:30")
        self.assertFalse(items[0]["needs_review"])

    def test_normalize_ai_items_drops_empty_items(self):
        items = _normalize_ai_items([{}, {"course_code": "", "source_block": ""}])
        self.assertEqual(items, [])


if __name__ == "__main__":
    unittest.main()
