import SwiftUI
import WidgetKit

struct SmallWidgetView: View {
    let entry: ScheduleWidgetEntry

    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [Color(red: 0.09, green: 0.23, blue: 0.54), Color(red: 0.12, green: 0.35, blue: 0.78)]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 8) {
                Text("Next Class")
                    .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundColor(.white.opacity(0.85))

                if let next = entry.nextClass {
                    Text(next.title)
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .lineLimit(2)

                    Text(timeRange(for: next))
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.92))
                        .lineLimit(1)

                    if let room = next.room, !room.isEmpty {
                        Text(room)
                            .font(.caption2)
                            .foregroundColor(.white.opacity(0.85))
                            .lineLimit(1)
                    }
                } else {
                    Text("No upcoming classes")
                        .font(.headline)
                        .foregroundColor(.white)
                        .lineLimit(2)
                }

                Spacer()
            }
            .padding(14)
        }
        .containerBackground(.clear, for: .widget)
    }

    private func timeRange(for item: ScheduleWidgetClass) -> String {
        let start = item.startTime ?? "--:--"
        let end = item.endTime ?? "--:--"
        return "\(start) - \(end)"
    }
}

struct MediumWidgetView: View {
    let entry: ScheduleWidgetEntry

    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [Color(red: 0.95, green: 0.97, blue: 1.0), Color(red: 0.90, green: 0.94, blue: 1.0)]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 10) {
                Text("Today's Schedule")
                    .font(.headline)
                    .foregroundColor(Color(red: 0.06, green: 0.16, blue: 0.37))

                if entry.todayClasses.isEmpty {
                    Text("No classes today")
                        .font(.subheadline)
                        .foregroundColor(Color(red: 0.35, green: 0.43, blue: 0.56))
                } else {
                    VStack(spacing: 8) {
                        ForEach(Array(entry.todayClasses.prefix(4))) { item in
                            HStack(alignment: .top) {
                                Text(timeRange(for: item))
                                    .font(.caption)
                                    .fontWeight(.semibold)
                                    .foregroundColor(Color(red: 0.12, green: 0.26, blue: 0.51))
                                    .frame(width: 68, alignment: .leading)

                                VStack(alignment: .leading, spacing: 2) {
                                    Text(item.title)
                                        .font(.subheadline)
                                        .foregroundColor(Color(red: 0.06, green: 0.16, blue: 0.37))
                                        .lineLimit(1)

                                    if let room = item.room, !room.isEmpty {
                                        Text(room)
                                            .font(.caption2)
                                            .foregroundColor(Color(red: 0.36, green: 0.45, blue: 0.57))
                                            .lineLimit(1)
                                    }
                                }

                                Spacer(minLength: 0)
                            }
                        }
                    }
                }

                Spacer()
            }
            .padding(14)
        }
        .containerBackground(.clear, for: .widget)
    }

    private func timeRange(for item: ScheduleWidgetClass) -> String {
        let start = item.startTime ?? "--:--"
        let end = item.endTime ?? "--:--"
        return "\(start)-\(end)"
    }
}

