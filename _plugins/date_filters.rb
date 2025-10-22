require 'date'

module Jekyll
  module DateFilters
    # Calculate career duration from start date to current time
    # Returns formatted string in Korean (e.g., "10년 6개월")
    #
    # Usage:
    #   {{ '2015-04-01' | career_duration }}
    #   {{ site.career_start_date | career_duration }}
    #
    # @param start_date [String, Date] Start date (String in YYYY-MM-DD format or Date object)
    # @return [String] Formatted duration string
    def career_duration(start_date)
      return "Invalid date" if start_date.nil?

      begin
        # Handle both String and Date objects
        start_time = start_date.is_a?(Date) ? start_date : Date.parse(start_date.to_s)
        current_time = Date.today

        # Calculate years and months
        years = current_time.year - start_time.year
        months = current_time.month - start_time.month

        # Adjust if months is negative
        if months < 0
          years -= 1
          months += 12
        end

        "#{years}년 #{months}개월"
      rescue ArgumentError => e
        "Invalid date format"
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::DateFilters)
