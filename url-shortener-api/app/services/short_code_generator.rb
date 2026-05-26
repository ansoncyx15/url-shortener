# Generates a random, collision-checked base62 short code.
module ShortCodeGenerator
  ALPHABET = [*"a".."z", *"A".."Z", *"0".."9"].freeze
  DEFAULT_LENGTH = 7

  def self.generate(length = DEFAULT_LENGTH)
    loop do
      code = Array.new(length) { ALPHABET.sample }.join
      return code unless Url.where(short_code: code).exists?
    end
  end
end
