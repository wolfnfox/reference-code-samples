using System.Diagnostics;
using System.Diagnostics.Metrics;

namespace OpenTelemetry
{
    public abstract class DurationTracker : IDisposable
    {
        protected readonly Histogram<double> _histogram;
        protected readonly long _startTime = TimeProvider.System.GetTimestamp();
        protected readonly TagList _tags;
        private bool _disposed;

        protected DurationTracker(Histogram<double> histogram, ref TagList tags)
        {
            ArgumentNullException.ThrowIfNull(histogram);
            (_histogram, _tags) = (histogram, tags);

            if (_histogram.Unit != "ms" && _histogram.Unit != "s" && _histogram.Unit != "min")
            {
                throw new NotSupportedException($"Unsupported histogram unit: {_histogram.Unit}");
            }
        }

        public void AddTag(string key, object value)
            => _tags.Add(key, value);

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    var elapsed = TimeProvider.System.GetElapsedTime(_startTime);
                    switch (_histogram.Unit)
                    {
                        case "ms":
                            _histogram.Record(elapsed.TotalMilliseconds, _tags);
                            break;
                        case "s":
                            _histogram.Record(elapsed.TotalSeconds, _tags);
                            break;
                        case "min":
                            _histogram.Record(elapsed.TotalMinutes, _tags);
                            break;
                        default:
                            throw new NotSupportedException($"Unsupported histogram unit: {_histogram.Unit}");
                    }
                }
                _disposed = true;
            }
        }
    }
}
