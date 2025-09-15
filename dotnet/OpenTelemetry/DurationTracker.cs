using System.Diagnostics;
using System.Diagnostics.Metrics;

namespace OpenTelemetry
{

    /// <summary>
    /// Provides an abstract base class for tracking the duration of an operation and recording the elapsed time to a
    /// histogram upon disposal.
    /// </summary>
    /// <remarks>DurationTracker is intended for scenarios where measuring and recording the time taken by an
    /// operation is required, such as performance monitoring or telemetry. The recorded duration is automatically added
    /// to the specified histogram when the tracker is disposed. The histogram must use a supported unit: milliseconds
    /// ("ms"), seconds ("s"), or minutes ("min"). Additional tags can be associated with the recorded measurement for
    /// contextual information. This class is not thread-safe and should be disposed once per usage.</remarks>
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

        /// <summary>
        /// Adds a tag with the specified key and value to the list.
        /// </summary>
        /// <param name="key">The tag key. Cannot be null.</param>
        /// <param name="value">The tag value. Can be any value type or null.</param>
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
