require "rails_helper"

RSpec.describe ShortCodeGenerator do
  describe ".generate" do
    it "generates a short code with default length" do
      allow(Url).to receive_message_chain(:where, :exists?).and_return(false)

      code = described_class.generate

      expect(code.length).to eq(7)
    end

    it "generates a short code with custom length" do
      allow(Url).to receive_message_chain(:where, :exists?).and_return(false)

      code = described_class.generate(10)

      expect(code.length).to eq(10)
    end

    it "retries until a unique code is found" do
      # Simulate: first candidate collides, second is unique.
      allow(Url).to receive_message_chain(:where, :exists?).and_return(true, false)

      code = described_class.generate

      expect(code).to match(/\A[a-zA-Z0-9]{7}\z/)
    end
  end
end