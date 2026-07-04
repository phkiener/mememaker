#!/usr/bin/dotnet run
#:sdk Microsoft.NET.Sdk.Web

using Microsoft.Extensions.FileProviders;

var fileProvider = args switch
{
    [var path] when Path.IsPathRooted(path) => new PhysicalFileProvider(path),
    [var path] => new PhysicalFileProvider(Path.Combine(Environment.CurrentDirectory, path)),
    [] => new PhysicalFileProvider(Environment.CurrentDirectory),
    _ => throw new ArgumentException("Usage: ./server.cs [path]")
};

var builder = WebApplication.CreateBuilder();
builder.Logging.ClearProviders();
builder.Environment.WebRootFileProvider = fileProvider;

var app = builder.Build();
app.UseStaticFiles(new StaticFileOptions { ServeUnknownFileTypes = true });
app.MapFallbackToFile("index.html");

var server = app.RunAsync();
Console.WriteLine($"==> Serving at {app.Urls.First()} ({fileProvider.Root})");

await server;
