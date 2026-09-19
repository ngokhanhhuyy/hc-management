namespace HCManagement.Core.Common.Exceptions;

public abstract class CoreException : Exception
{
    #region Constructors
    protected CoreException() { }

    protected CoreException(string message) : this(Array.Empty<object>(), message) { }
    
    protected CoreException(object[] propertyPathElements, string message)
    {
        Errors.Add(propertyPathElements, message);
    }
    #endregion
    
    #region Properties
    public Dictionary<object[], string> Errors { get; private set; } = new();
    #endregion

    #region Methods
    public void AddPropertyPathElementToTheBeginning(IEnumerable<object> propertyPathElements)
    {
        Errors = Errors
            .Select(p =>
            {
                List<object> modifiedPropertyPathElements = propertyPathElements.ToList();
                modifiedPropertyPathElements.AddRange(p.Key);

                return new
                {
                    PropertyPathElements = modifiedPropertyPathElements.ToArray(),
                    Message = p.Value
                };
            })
            .ToDictionary(p => p.PropertyPathElements, p => p.Message);
    }
    #endregion
}
